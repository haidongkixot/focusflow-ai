import prisma from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

// --- XP Configuration ---
export const XP_REWARDS = {
  focus_session: 20,
  task_complete: 15,
  four_cycle: 50,
  streak_bonus: 10,
  goal_progress: 5,
  daily_target: 30,
} as const

export type XpSource = keyof typeof XP_REWARDS

// --- Badge Definitions ---
export const BADGES = {
  first_focus: { name: 'First Focus', description: 'Complete your first focus session' },
  streak_3: { name: 'On Fire', description: 'Maintain a 3-day streak' },
  streak_7: { name: 'Week Warrior', description: 'Maintain a 7-day streak' },
  streak_30: { name: 'Monthly Master', description: 'Maintain a 30-day streak' },
  xp_100: { name: 'Centurion', description: 'Earn 100 XP' },
  xp_1000: { name: 'Thousandaire', description: 'Earn 1,000 XP' },
  tasks_10: { name: 'Task Crusher', description: 'Complete 10 tasks' },
  tasks_100: { name: 'Productivity Machine', description: 'Complete 100 tasks' },
  four_cycles_first: { name: 'Full Circuit', description: 'Complete your first 4-cycle set' },
  focus_hours_10: { name: 'Deep Worker', description: 'Accumulate 10 hours of focus time' },
} as const

// --- Level Thresholds ---
export function getLevelFromXp(totalXp: number): { level: number; currentXp: number; nextLevelXp: number } {
  let level = 1
  let threshold = 100
  let accumulated = 0

  while (totalXp >= accumulated + threshold) {
    accumulated += threshold
    level++
    threshold = Math.floor(threshold * 1.3)
  }

  return {
    level,
    currentXp: totalXp - accumulated,
    nextLevelXp: threshold,
  }
}

// --- Award XP ---
export async function awardXp(userId: string, source: XpSource, metadata?: Prisma.InputJsonValue) {
  const amount = XP_REWARDS[source]

  const xpEvent = await prisma.xpEvent.create({
    data: {
      userId,
      source,
      amount,
      metadata: metadata ?? undefined,
    },
  })

  // Update daily log
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.dailyLog.upsert({
    where: { userId_date: { userId, date: today } },
    update: { xpEarned: { increment: amount } },
    create: { userId, date: today, xpEarned: amount },
  })

  // Check for XP-based badges
  const totalXp = await getTotalXp(userId)
  if (totalXp >= 100) await tryAwardBadge(userId, 'xp_100')
  if (totalXp >= 1000) await tryAwardBadge(userId, 'xp_1000')

  return { xpEvent, totalXp, level: getLevelFromXp(totalXp) }
}

// --- Get Total XP ---
export async function getTotalXp(userId: string): Promise<number> {
  const result = await prisma.xpEvent.aggregate({
    where: { userId },
    _sum: { amount: true },
  })
  return result._sum.amount ?? 0
}

// --- Streak Management ---
export async function updateStreak(userId: string, type: string = 'daily_focus') {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const streak = await prisma.streak.upsert({
    where: { userId_type: { userId, type } },
    update: {},
    create: { userId, type, current: 0, longest: 0 },
  })

  const lastActive = streak.lastActiveAt
    ? new Date(streak.lastActiveAt.getFullYear(), streak.lastActiveAt.getMonth(), streak.lastActiveAt.getDate())
    : null

  // Already counted today
  if (lastActive && lastActive.getTime() === today.getTime()) {
    return streak
  }

  let newCurrent: number
  if (lastActive && lastActive.getTime() === yesterday.getTime()) {
    newCurrent = streak.current + 1
  } else {
    newCurrent = 1
  }

  const newLongest = Math.max(streak.longest, newCurrent)

  const updated = await prisma.streak.update({
    where: { userId_type: { userId, type } },
    data: { current: newCurrent, longest: newLongest, lastActiveAt: now },
  })

  // Check streak badges
  if (newCurrent >= 3) await tryAwardBadge(userId, 'streak_3')
  if (newCurrent >= 7) await tryAwardBadge(userId, 'streak_7')
  if (newCurrent >= 30) await tryAwardBadge(userId, 'streak_30')

  // Streak bonus XP
  if (newCurrent > 1) {
    await awardXp(userId, 'streak_bonus', { streakDays: newCurrent })
  }

  return updated
}

// --- Badge Helpers ---
async function tryAwardBadge(userId: string, badge: string, tier: string = 'bronze') {
  try {
    await prisma.userBadge.create({
      data: { userId, badge, tier },
    })
    return true
  } catch {
    // Already has badge (unique constraint)
    return false
  }
}

// --- Session Complete Handler ---
export async function onFocusSessionComplete(userId: string, durationMins: number, cycleNumber?: number) {
  const result = await awardXp(userId, 'focus_session', { durationMins })

  // First focus badge
  await tryAwardBadge(userId, 'first_focus')

  // Four-cycle bonus
  if (cycleNumber && cycleNumber % 4 === 0) {
    await awardXp(userId, 'four_cycle', { cycleNumber })
    await tryAwardBadge(userId, 'four_cycles_first')
  }

  // Update daily log
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  await prisma.dailyLog.upsert({
    where: { userId_date: { userId, date: today } },
    update: {
      focusMins: { increment: durationMins },
      sessionsCount: { increment: 1 },
    },
    create: { userId, date: today, focusMins: durationMins, sessionsCount: 1 },
  })

  // Update streak
  await updateStreak(userId)

  // Check focus hours badge
  const totalFocus = await prisma.dailyLog.aggregate({
    where: { userId },
    _sum: { focusMins: true },
  })
  if ((totalFocus._sum.focusMins ?? 0) >= 600) {
    await tryAwardBadge(userId, 'focus_hours_10')
  }

  return result
}

// --- Task Complete Handler ---
export async function onTaskComplete(userId: string, taskId: string) {
  const result = await awardXp(userId, 'task_complete', { taskId })

  // Update daily log
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  await prisma.dailyLog.upsert({
    where: { userId_date: { userId, date: today } },
    update: { tasksCompleted: { increment: 1 } },
    create: { userId, date: today, tasksCompleted: 1 },
  })

  // Check task badges
  const taskCount = await prisma.task.count({
    where: { userId, status: 'done' },
  })
  if (taskCount >= 10) await tryAwardBadge(userId, 'tasks_10')
  if (taskCount >= 100) await tryAwardBadge(userId, 'tasks_100')

  return result
}
