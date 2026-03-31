import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PLANS = [
  {
    slug: 'free',
    name: 'Free',
    priceMonthly: 0,
    maxTasks: 10,
    maxSessions: 3,
    features: {
      timer: true,
      basicTasks: true,
      dailyProgress: true,
      aiCoach: false,
      advancedFocusModes: false,
      detailedAnalytics: false,
      teamCollaboration: false,
    },
  },
  {
    slug: 'pro',
    name: 'Pro',
    priceMonthly: 499,
    maxTasks: -1,
    maxSessions: -1,
    features: {
      timer: true,
      basicTasks: true,
      dailyProgress: true,
      aiCoach: true,
      advancedFocusModes: true,
      detailedAnalytics: true,
      teamCollaboration: true,
      prioritySupport: true,
      customCategories: true,
    },
  },
]

const BADGES = [
  {
    slug: 'first-focus',
    name: 'First Focus',
    description: 'Complete your first focus session',
    icon: 'timer',
    category: 'milestone',
    requirement: { type: 'sessions_completed', count: 1 },
  },
  {
    slug: 'session-streak-7',
    name: 'Week Warrior',
    description: '7-day focus streak',
    icon: 'flame',
    category: 'streak',
    requirement: { type: 'streak_days', count: 7 },
  },
  {
    slug: 'session-streak-30',
    name: 'Monthly Master',
    description: '30-day focus streak',
    icon: 'crown',
    category: 'streak',
    requirement: { type: 'streak_days', count: 30 },
  },
  {
    slug: 'focus-100-hours',
    name: 'Centurion',
    description: 'Accumulate 100 hours of focus time',
    icon: 'clock',
    category: 'milestone',
    requirement: { type: 'total_focus_hours', count: 100 },
  },
  {
    slug: 'tasks-50',
    name: 'Task Slayer',
    description: 'Complete 50 tasks',
    icon: 'check-circle',
    category: 'milestone',
    requirement: { type: 'tasks_completed', count: 50 },
  },
  {
    slug: 'tasks-200',
    name: 'Productivity Machine',
    description: 'Complete 200 tasks',
    icon: 'zap',
    category: 'milestone',
    requirement: { type: 'tasks_completed', count: 200 },
  },
  {
    slug: 'xp-1000',
    name: 'Rising Star',
    description: 'Earn 1,000 XP',
    icon: 'star',
    category: 'xp',
    requirement: { type: 'total_xp', count: 1000 },
  },
  {
    slug: 'xp-10000',
    name: 'Focus Legend',
    description: 'Earn 10,000 XP',
    icon: 'trophy',
    category: 'xp',
    requirement: { type: 'total_xp', count: 10000 },
  },
  {
    slug: 'early-bird',
    name: 'Early Bird',
    description: 'Complete a session before 7 AM',
    icon: 'sunrise',
    category: 'special',
    requirement: { type: 'session_before_hour', hour: 7 },
  },
  {
    slug: 'night-owl',
    name: 'Night Owl',
    description: 'Complete a session after 11 PM',
    icon: 'moon',
    category: 'special',
    requirement: { type: 'session_after_hour', hour: 23 },
  },
]

async function main() {
  console.log('Seeding Plans...')
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        priceMonthly: plan.priceMonthly,
        maxTasks: plan.maxTasks,
        maxSessions: plan.maxSessions,
        features: plan.features,
      },
      create: plan,
    })
    console.log(`  Plan: ${plan.name}`)
  }

  console.log('Seeding Badges...')
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        requirement: badge.requirement,
      },
      create: badge,
    })
    console.log(`  Badge: ${badge.name}`)
  }

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
