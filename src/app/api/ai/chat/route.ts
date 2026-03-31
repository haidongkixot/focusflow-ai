import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are FocusFlow Coach, an expert AI productivity and focus advisor. You help users with:
- Focus techniques (Pomodoro, deep work, time blocking)
- Beating procrastination and building habits
- Energy management and work-life balance
- Task prioritization and goal setting
- Study techniques and creative focus strategies

Be concise, actionable, and encouraging. Use bullet points for tips. Keep responses under 300 words.
Reference the user's data when available (tasks, sessions, streaks).`

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const messages = await prisma.coachMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    take: 50,
  })

  return NextResponse.json({ messages })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const { message } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

  // Save user message
  await prisma.coachMessage.create({
    data: { userId, role: 'user', content: message.trim() },
  })

  // Gather user context
  const [recentSessions, taskStats, streak] = await Promise.all([
    prisma.focusSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 5,
      select: { durationMins: true, completed: true, type: true, startedAt: true },
    }),
    prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
    }),
    prisma.streak.findFirst({
      where: { userId, type: 'daily_focus' },
    }),
  ])

  const contextNote = `
User context:
- Recent sessions: ${recentSessions.length} (${recentSessions.filter((s) => s.completed).length} completed)
- Tasks: ${taskStats.map((t) => `${t.status}: ${t._count}`).join(', ')}
- Current streak: ${streak?.current ?? 0} days (longest: ${streak?.longest ?? 0})
`

  // Fetch conversation history
  const history = await prisma.coachMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    take: 20,
  })

  const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT + '\n' + contextNote },
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ]

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      max_tokens: 500,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || 'I could not generate a response. Please try again.'

    // Save assistant reply
    await prisma.coachMessage.create({
      data: { userId, role: 'assistant', content: reply },
    })

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Coach AI error:', error)
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 })
  }
}
