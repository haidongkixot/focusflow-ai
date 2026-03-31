import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

const DAILY_QUESTS = [
  {
    slug: 'complete-session',
    title: 'Complete a Focus Session',
    description: 'Finish at least one focus session today',
    target: 1,
    xpReward: 50,
  },
  {
    slug: 'finish-task',
    title: 'Finish a Task',
    description: 'Mark at least one task as done',
    target: 1,
    xpReward: 50,
  },
  {
    slug: 'focus-60-mins',
    title: 'Hit 60 Minutes Focused',
    description: 'Accumulate 60 minutes of focus time today',
    target: 60,
    xpReward: 100,
  },
]

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Ensure daily quests exist for today
  const existing = await prisma.quest.findMany({
    where: { userId, date: today },
  })

  if (existing.length === 0) {
    await prisma.quest.createMany({
      data: DAILY_QUESTS.map((q) => ({
        userId,
        slug: q.slug,
        title: q.title,
        description: q.description,
        type: 'daily',
        target: q.target,
        xpReward: q.xpReward,
        date: today,
      })),
    })
  }

  // Calculate progress from real data
  const startOfDay = today
  const endOfDay = new Date(today)
  endOfDay.setHours(23, 59, 59, 999)

  const [sessionsToday, tasksToday, focusMinsToday] = await Promise.all([
    prisma.focusSession.count({
      where: { userId, completed: true, startedAt: { gte: startOfDay, lte: endOfDay } },
    }),
    prisma.task.count({
      where: { userId, status: 'done', completedAt: { gte: startOfDay, lte: endOfDay } },
    }),
    prisma.focusSession.aggregate({
      where: { userId, completed: true, startedAt: { gte: startOfDay, lte: endOfDay } },
      _sum: { durationMins: true },
    }),
  ])

  const totalFocusMins = focusMinsToday._sum.durationMins || 0

  // Update quest progress
  const progressMap: Record<string, number> = {
    'complete-session': sessionsToday,
    'finish-task': tasksToday,
    'focus-60-mins': totalFocusMins,
  }

  const quests = await prisma.quest.findMany({
    where: { userId, date: today },
  })

  for (const quest of quests) {
    const progress = progressMap[quest.slug] ?? quest.progress
    const completed = progress >= quest.target
    if (progress !== quest.progress || completed !== quest.completed) {
      await prisma.quest.update({
        where: { id: quest.id },
        data: {
          progress,
          completed,
          completedAt: completed && !quest.completedAt ? new Date() : quest.completedAt,
        },
      })

      // Award XP on first completion
      if (completed && !quest.completed) {
        await prisma.xpEvent.create({
          data: { userId, source: `quest:${quest.slug}`, amount: quest.xpReward },
        })
      }
    }
  }

  // Re-fetch updated quests
  const updatedQuests = await prisma.quest.findMany({
    where: { userId, date: today },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ quests: updatedQuests })
}
