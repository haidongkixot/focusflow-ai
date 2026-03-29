import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay())

  const [
    totalSessions,
    todaySessions,
    weekSessions,
    totalTasks,
    doneTasks,
    achievements,
    last7Days,
  ] = await Promise.all([
    prisma.focusSession.count({ where: { userId, type: 'focus', completed: true } }),
    prisma.focusSession.count({ where: { userId, type: 'focus', completed: true, startedAt: { gte: startOfToday } } }),
    prisma.focusSession.count({ where: { userId, type: 'focus', completed: true, startedAt: { gte: startOfWeek } } }),
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: 'done' } }),
    prisma.userAchievement.findMany({ where: { userId }, orderBy: { earnedAt: 'desc' } }),
    prisma.focusSession.groupBy({
      by: ['startedAt'],
      where: {
        userId,
        type: 'focus',
        completed: true,
        startedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      _sum: { actualMins: true },
      _count: { id: true },
    }),
  ])

  // Build daily chart data
  const dailyMap: Record<string, { mins: number; sessions: number }> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(startOfToday)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    dailyMap[key] = { mins: 0, sessions: 0 }
  }

  for (const row of last7Days) {
    const key = new Date(row.startedAt).toISOString().split('T')[0]
    if (dailyMap[key]) {
      dailyMap[key].mins += row._sum.actualMins ?? 0
      dailyMap[key].sessions += row._count.id
    }
  }

  const chartData = Object.entries(dailyMap).map(([date, data]) => ({
    date,
    label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    mins: data.mins,
    sessions: data.sessions,
  }))

  return NextResponse.json({
    stats: {
      totalSessions,
      todaySessions,
      weekSessions,
      totalTasks,
      doneTasks,
      completionRate: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
    },
    chartData,
    achievements,
  })
}
