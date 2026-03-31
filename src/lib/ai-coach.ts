import prisma from '@/lib/prisma'
import logger from '@/lib/logger'
import { getProductivityStats, getSessionAnalytics, getStreakInfo } from '@/lib/analytics'
import { getTotalXp, getLevelFromXp } from '@/lib/gamification'

// --- Coach Persona ---
const COACH_SYSTEM_PROMPT = `You are FocusFlow Coach, an AI productivity coach. Your role:
- Motivate users to stay focused and build consistent habits
- Analyze their productivity data and provide actionable insights
- Celebrate wins and gently address areas for improvement
- Suggest optimal focus/break durations based on their patterns
- Keep responses concise, warm, and encouraging
- Use data-driven recommendations when stats are available
- Never be preachy or judgmental about unproductive periods`

// --- Message Types ---
export type CoachRole = 'user' | 'assistant' | 'system'

export interface CoachContext {
  totalXp: number
  level: ReturnType<typeof getLevelFromXp>
  stats: Awaited<ReturnType<typeof getProductivityStats>>
  sessionAnalytics: Awaited<ReturnType<typeof getSessionAnalytics>>
  streaks: Awaited<ReturnType<typeof getStreakInfo>>
  pendingTasks: number
}

// --- Build Context ---
async function buildCoachContext(userId: string): Promise<CoachContext> {
  const [totalXp, stats, sessionAnalytics, streaks, pendingTasks] = await Promise.all([
    getTotalXp(userId),
    getProductivityStats(userId, 7),
    getSessionAnalytics(userId, 7),
    getStreakInfo(userId),
    prisma.task.count({ where: { userId, status: { in: ['todo', 'in_progress'] } } }),
  ])

  return {
    totalXp,
    level: getLevelFromXp(totalXp),
    stats,
    sessionAnalytics,
    streaks,
    pendingTasks,
  }
}

function contextToPrompt(ctx: CoachContext): string {
  const streak = ctx.streaks.find((s) => s.type === 'daily_focus')
  return [
    `User Stats (last 7 days):`,
    `- Level ${ctx.level.level} (${ctx.totalXp} XP total, ${ctx.level.currentXp}/${ctx.level.nextLevelXp} to next)`,
    `- Focus: ${ctx.stats.totals.focusHours}h across ${ctx.stats.totals.sessions} sessions`,
    `- Tasks completed: ${ctx.stats.totals.tasksCompleted}`,
    `- Active days: ${ctx.stats.totals.activeDays}/7`,
    `- Session completion rate: ${ctx.sessionAnalytics.sessions.completionRate}%`,
    `- Current streak: ${streak?.current ?? 0} days (longest: ${streak?.longest ?? 0})`,
    `- Pending tasks: ${ctx.pendingTasks}`,
    ctx.sessionAnalytics.peakHour
      ? `- Peak productivity hour: ${ctx.sessionAnalytics.peakHour.hour}:00`
      : null,
  ]
    .filter(Boolean)
    .join('\n')
}

// --- Chat with Coach ---
export async function chatWithCoach(userId: string, userMessage: string) {
  try {
    const ctx = await buildCoachContext(userId)

    // Save user message
    await prisma.coachMessage.create({
      data: { userId, role: 'user', content: userMessage },
    })

    // Get recent conversation history (last 10 messages)
    const history = await prisma.coachMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    history.reverse()

    // Build messages for AI
    const messages = [
      { role: 'system' as const, content: `${COACH_SYSTEM_PROMPT}\n\n${contextToPrompt(ctx)}` },
      ...history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    // Call AI (using OpenAI-compatible API)
    const apiKey = process.env.OPENAI_API_KEY
    const apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'
    const model = process.env.COACH_MODEL || 'gpt-4o-mini'

    if (!apiKey) {
      logger.warn('No OPENAI_API_KEY set, returning fallback coach response')
      return generateFallbackResponse(ctx, userMessage)
    }

    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      logger.error('Coach API call failed', { status: response.status })
      return generateFallbackResponse(ctx, userMessage)
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content ?? 'Keep up the great work!'

    // Save assistant message
    await prisma.coachMessage.create({
      data: {
        userId,
        role: 'assistant',
        content: assistantMessage,
        context: { level: ctx.level.level, totalXp: ctx.totalXp },
      },
    })

    return {
      message: assistantMessage,
      context: ctx,
    }
  } catch (err) {
    logger.error('Coach chat error', {
      error: err instanceof Error ? err.message : String(err),
      userId,
    })
    throw err
  }
}

// --- Fallback (no API key) ---
function generateFallbackResponse(ctx: CoachContext, _userMessage: string) {
  const tips: string[] = []

  if (ctx.stats.totals.activeDays < 3) {
    tips.push('Try to be active at least 4-5 days this week. Consistency beats intensity.')
  }
  if (ctx.sessionAnalytics.sessions.completionRate < 70) {
    tips.push('Your session completion rate could improve. Consider shorter focus sessions to build momentum.')
  }
  if (ctx.pendingTasks > 10) {
    tips.push(`You have ${ctx.pendingTasks} pending tasks. Consider prioritizing the top 3 for today.`)
  }

  const streak = ctx.streaks.find((s) => s.type === 'daily_focus')
  if (streak && streak.current > 0) {
    tips.push(`Great job on your ${streak.current}-day streak! Keep it going!`)
  }

  if (ctx.stats.totals.focusHours > 0) {
    tips.push(`You've focused for ${ctx.stats.totals.focusHours} hours this week. ${ctx.stats.totals.focusHours >= 10 ? 'Outstanding!' : 'Keep building up!'}`)
  }

  const message = tips.length > 0
    ? tips.join('\n\n')
    : `You're at Level ${ctx.level.level} with ${ctx.totalXp} XP. Start a focus session to keep progressing!`

  return { message, context: ctx }
}

// --- Quick Insights ---
export async function getDailyInsight(userId: string) {
  const ctx = await buildCoachContext(userId)
  const streak = ctx.streaks.find((s) => s.type === 'daily_focus')

  const insights: string[] = []

  if (streak && streak.current > 0) {
    insights.push(`Day ${streak.current} streak active`)
  }

  if (ctx.stats.totals.focusMins > 0) {
    const todayLog = ctx.stats.dailyBreakdown[ctx.stats.dailyBreakdown.length - 1]
    if (todayLog) {
      insights.push(`Today: ${todayLog.focusMins}min focused, ${todayLog.tasksCompleted} tasks`)
    }
  }

  insights.push(`Level ${ctx.level.level} - ${ctx.level.currentXp}/${ctx.level.nextLevelXp} XP to next level`)

  return { insights, context: ctx }
}

// --- Session Feedback ---
export async function getSessionFeedback(userId: string, sessionMins: number, completed: boolean) {
  const ctx = await buildCoachContext(userId)

  if (!completed) {
    return {
      feedback: `No worries! Even ${sessionMins} minutes of focus is progress. Try again when you're ready.`,
      encouragement: true,
    }
  }

  const messages = [
    `Great ${sessionMins}-minute session! +20 XP earned.`,
    sessionMins >= 25 ? 'A full Pomodoro completed!' : '',
    ctx.level.currentXp + 20 >= ctx.level.nextLevelXp ? `Almost at Level ${ctx.level.level + 1}!` : '',
  ].filter(Boolean)

  return {
    feedback: messages.join(' '),
    encouragement: false,
  }
}
