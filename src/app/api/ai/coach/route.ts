import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Gather recent context
  const [recentSessions, tasks, totalCompleted] = await Promise.all([
    prisma.focusSession.findMany({
      where: { userId: session.user.id, type: 'focus' },
      orderBy: { startedAt: 'desc' },
      take: 10,
    }),
    prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.focusSession.count({
      where: { userId: session.user.id, type: 'focus', completed: true },
    }),
  ])

  const completedSessions = recentSessions.filter(s => s.completed).length
  const avgActual = recentSessions.length
    ? Math.round(recentSessions.reduce((acc, s) => acc + (s.actualMins ?? 0), 0) / recentSessions.length)
    : 0
  const pendingTasks = tasks.filter(t => t.status !== 'done').length
  const doneTasks = tasks.filter(t => t.status === 'done').length

  const prompt = `You are a productivity coach for FocusFlow AI. Analyze this user's focus data and provide 2-3 specific, actionable insights.

Stats:
- Total completed focus sessions (all time): ${totalCompleted}
- Recent sessions (last 10): ${completedSessions} completed out of ${recentSessions.length}
- Average actual focus time: ${avgActual} min
- Current tasks: ${pendingTasks} pending, ${doneTasks} done recently

Provide concise, encouraging insights. Format as JSON: { "insights": ["insight1", "insight2", "insight3"], "tip": "one actionable tip for today" }`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 400,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({
      insights: [
        `You've completed ${totalCompleted} focus sessions — great consistency!`,
        pendingTasks > 5
          ? 'Consider breaking large tasks into smaller 25-min chunks.'
          : 'Your task list looks manageable. Keep the momentum going!',
        'Try the 2-minute rule: if a task takes less than 2 minutes, do it now.',
      ],
      tip: 'Start your next session within 5 minutes to maintain flow state.',
    })
  }
}
