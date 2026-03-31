import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const period = req.nextUrl.searchParams.get('period') || 'week'

  let dateFilter: Date | undefined
  const now = new Date()
  if (period === 'week') {
    dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (period === 'month') {
    dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  const whereClause = dateFilter ? { createdAt: { gte: dateFilter } } : {}

  // Aggregate XP per user
  const xpByUser = await prisma.xpEvent.groupBy({
    by: ['userId'],
    where: whereClause,
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 20,
  })

  if (xpByUser.length === 0) {
    return NextResponse.json({ leaderboard: [] })
  }

  const userIds = xpByUser.map((x) => x.userId)

  // Fetch user details, focus stats, and streaks in parallel
  const [users, focusStats, streaks] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    }),
    prisma.focusSession.groupBy({
      by: ['userId'],
      where: {
        userId: { in: userIds },
        completed: true,
        ...(dateFilter ? { startedAt: { gte: dateFilter } } : {}),
      },
      _sum: { durationMins: true },
      _count: true,
    }),
    prisma.streak.findMany({
      where: { userId: { in: userIds }, type: 'daily_focus' },
      select: { userId: true, current: true },
    }),
  ])

  const userMap = new Map(users.map((u) => [u.id, u]))
  const focusMap = new Map(focusStats.map((f) => [f.userId, f]))
  const streakMap = new Map(streaks.map((s) => [s.userId, s.current]))

  const leaderboard = xpByUser.map((entry, i) => {
    const user = userMap.get(entry.userId)
    const focus = focusMap.get(entry.userId)
    return {
      rank: i + 1,
      userId: entry.userId,
      name: user?.name || 'Anonymous',
      totalXp: entry._sum.amount || 0,
      focusMins: focus?._sum?.durationMins || 0,
      sessionsCount: focus?._count || 0,
      streak: streakMap.get(entry.userId) || 0,
    }
  })

  return NextResponse.json({ leaderboard })
}
