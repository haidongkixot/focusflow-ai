import prisma from '@/lib/prisma'
import logger from '@/lib/logger'

// --- Track Event ---
export async function trackEvent(
  userId: string,
  event: string,
  properties?: Record<string, string | number | boolean | null>
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        userId,
        event,
        properties: properties ?? undefined,
      },
    })
  } catch (err) {
    logger.error('Failed to track analytics event', {
      event,
      userId,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

// --- Productivity Stats ---
export async function getProductivityStats(userId: string, days: number = 7) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  const dailyLogs = await prisma.dailyLog.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: 'asc' },
  })

  const totalFocusMins = dailyLogs.reduce((sum, d) => sum + d.focusMins, 0)
  const totalTasks = dailyLogs.reduce((sum, d) => sum + d.tasksCompleted, 0)
  const totalSessions = dailyLogs.reduce((sum, d) => sum + d.sessionsCount, 0)
  const totalXp = dailyLogs.reduce((sum, d) => sum + d.xpEarned, 0)
  const activeDays = dailyLogs.filter((d) => d.focusMins > 0).length

  return {
    period: { days, since: since.toISOString() },
    totals: {
      focusMins: totalFocusMins,
      focusHours: Math.round((totalFocusMins / 60) * 10) / 10,
      tasksCompleted: totalTasks,
      sessions: totalSessions,
      xpEarned: totalXp,
      activeDays,
    },
    averages: {
      focusMinsPerDay: activeDays > 0 ? Math.round(totalFocusMins / activeDays) : 0,
      tasksPerDay: activeDays > 0 ? Math.round((totalTasks / activeDays) * 10) / 10 : 0,
      sessionsPerDay: activeDays > 0 ? Math.round((totalSessions / activeDays) * 10) / 10 : 0,
    },
    dailyBreakdown: dailyLogs.map((d) => ({
      date: d.date.toISOString().split('T')[0],
      focusMins: d.focusMins,
      tasksCompleted: d.tasksCompleted,
      sessions: d.sessionsCount,
      xp: d.xpEarned,
      mood: d.mood,
    })),
  }
}

// --- Session Analytics ---
export async function getSessionAnalytics(userId: string, days: number = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const sessions = await prisma.focusSession.findMany({
    where: { userId, startedAt: { gte: since } },
    orderBy: { startedAt: 'asc' },
  })

  const completed = sessions.filter((s) => s.completed)
  const completionRate = sessions.length > 0 ? Math.round((completed.length / sessions.length) * 100) : 0

  const totalPlannedMins = sessions.reduce((sum, s) => sum + s.durationMins, 0)
  const totalActualMins = sessions.reduce((sum, s) => sum + (s.actualMins ?? s.durationMins), 0)

  // Peak hours analysis
  const hourCounts: Record<number, number> = {}
  completed.forEach((s) => {
    const hour = s.startedAt.getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })

  const peakHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0]

  return {
    period: { days, since: since.toISOString() },
    sessions: {
      total: sessions.length,
      completed: completed.length,
      completionRate,
    },
    time: {
      totalPlannedMins,
      totalActualMins,
      avgSessionMins: completed.length > 0 ? Math.round(totalActualMins / completed.length) : 0,
    },
    peakHour: peakHour ? { hour: parseInt(peakHour[0]), sessions: peakHour[1] } : null,
  }
}

// --- Streak Info ---
export async function getStreakInfo(userId: string) {
  const streaks = await prisma.streak.findMany({
    where: { userId },
  })

  return streaks.map((s) => ({
    type: s.type,
    current: s.current,
    longest: s.longest,
    lastActive: s.lastActiveAt?.toISOString() ?? null,
  }))
}

// --- Leaderboard ---
export async function getLeaderboard(limit: number = 10) {
  const topUsers = await prisma.xpEvent.groupBy({
    by: ['userId'],
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: limit,
  })

  const userIds = topUsers.map((u) => u.userId)
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true },
  })

  const userMap = new Map(users.map((u) => [u.id, u]))

  return topUsers.map((entry, index) => {
    const user = userMap.get(entry.userId)
    return {
      rank: index + 1,
      userId: entry.userId,
      name: user?.name ?? 'Anonymous',
      image: user?.image ?? null,
      totalXp: entry._sum.amount ?? 0,
    }
  })
}
