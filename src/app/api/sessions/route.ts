import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

const createSchema = z.object({
  taskId: z.string().optional(),
  type: z.enum(['focus', 'short_break', 'long_break']),
  durationMins: z.number().int().min(1).max(120),
  actualMins: z.number().int().min(0).max(120),
  completed: z.boolean(),
  notes: z.string().optional(),
  startedAt: z.string(),
  endedAt: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') ?? '20')

  const sessions = await prisma.focusSession.findMany({
    where: { userId: session.user.id },
    include: { task: { select: { title: true } } },
    orderBy: { startedAt: 'desc' },
    take: Math.min(limit, 100),
  })

  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const data = parsed.data

  const focusSession = await prisma.focusSession.create({
    data: {
      userId: session.user.id,
      taskId: data.taskId,
      type: data.type,
      durationMins: data.durationMins,
      actualMins: data.actualMins,
      completed: data.completed,
      notes: data.notes,
      startedAt: new Date(data.startedAt),
      endedAt: data.endedAt ? new Date(data.endedAt) : undefined,
    },
  })

  // Increment focusSessions count on task if applicable
  if (data.taskId && data.type === 'focus' && data.completed) {
    await prisma.task.update({
      where: { id: data.taskId },
      data: { focusSessionCount: { increment: 1 } },
    })
  }

  // Check achievements
  const totalSessions = await prisma.focusSession.count({
    where: { userId: session.user.id, type: 'focus', completed: true },
  })

  const milestones = [1, 10, 25, 50, 100]
  for (const m of milestones) {
    if (totalSessions === m) {
      await prisma.userAchievement.upsert({
        where: { userId_type_name: { userId: session.user.id, type: 'sessions', name: `${m}_sessions` } },
        create: {
          userId: session.user.id,
          type: 'sessions',
          name: `${m}_sessions`,
          description: `Completed ${m} focus session${m > 1 ? 's' : ''}`,
        },
        update: {},
      })
    }
  }

  return NextResponse.json(focusSession, { status: 201 })
}
