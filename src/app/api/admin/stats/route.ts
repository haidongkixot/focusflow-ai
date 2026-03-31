import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'admin') throw new Error('Unauthorized')
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const now = new Date()
    // Build last 7 days date range
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const [
      totalUsers,
      totalSessionsCompleted,
      totalTasks,
      doneTasksCount,
      focusMinutesAgg,
      sessionsByTypeFocus,
      sessionsByTypeShortBreak,
      sessionsByTypeLongBreak,
      last7DaysSessions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.focusSession.count({ where: { completed: true } }),
      prisma.task.count(),
      prisma.task.count({ where: { status: 'done' } }),
      prisma.focusSession.aggregate({
        _sum: { actualMins: true },
        where: { completed: true },
      }),
      prisma.focusSession.count({ where: { type: 'focus', completed: true } }),
      prisma.focusSession.count({ where: { type: 'short_break', completed: true } }),
      prisma.focusSession.count({ where: { type: 'long_break', completed: true } }),
      prisma.focusSession.findMany({
        where: {
          completed: true,
          startedAt: { gte: sevenDaysAgo },
        },
        select: {
          startedAt: true,
          actualMins: true,
        },
        orderBy: { startedAt: 'asc' },
      }),
    ])

    const completionRate =
      totalTasks > 0 ? Math.round((doneTasksCount / totalTasks) * 100) : 0
    const totalFocusMins = focusMinutesAgg._sum.actualMins ?? 0

    // Build last7Days array grouped by date
    const dateMap = new Map<string, { sessions: number; mins: number }>()
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo)
      d.setDate(d.getDate() + i)
      const key = d.toISOString().split('T')[0]
      dateMap.set(key, { sessions: 0, mins: 0 })
    }

    for (const s of last7DaysSessions) {
      const key = new Date(s.startedAt).toISOString().split('T')[0]
      const existing = dateMap.get(key)
      if (existing) {
        existing.sessions += 1
        existing.mins += s.actualMins ?? 0
      }
    }

    const last7Days = Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      sessions: data.sessions,
      mins: data.mins,
    }))

    return NextResponse.json({
      totalUsers,
      totalSessions: totalSessionsCompleted,
      totalTasks,
      doneTasks: doneTasksCount,
      completionRate,
      totalFocusMins,
      sessionsByType: {
        focus: sessionsByTypeFocus,
        short_break: sessionsByTypeShortBreak,
        long_break: sessionsByTypeLongBreak,
      },
      last7Days,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
