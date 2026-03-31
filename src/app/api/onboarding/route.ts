import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const { goal, experience, workStyle } = await req.json()

  // Set focus duration based on experience
  const focusDurations: Record<string, number> = {
    beginner: 20,
    intermediate: 25,
    advanced: 45,
  }

  const dailyGoals: Record<string, number> = {
    beginner: 60,
    intermediate: 120,
    advanced: 180,
  }

  // Upsert user settings
  await prisma.userSettings.upsert({
    where: { userId },
    update: {
      focusDurationMins: focusDurations[experience] || 25,
      dailyGoalMins: dailyGoals[experience] || 120,
    },
    create: {
      userId,
      focusDurationMins: focusDurations[experience] || 25,
      dailyGoalMins: dailyGoals[experience] || 120,
    },
  })

  // Create initial goal
  const goalTitles: Record<string, string> = {
    'deep-work': 'Master Deep Work',
    'task-management': 'Become a Task Master',
    study: 'Level Up My Study Game',
    'creative-focus': 'Unlock Creative Flow',
  }

  await prisma.goal.create({
    data: {
      userId,
      title: goalTitles[goal] || 'Improve My Productivity',
      description: `Primary focus: ${goal}, Experience: ${experience}, Work style: ${workStyle}`,
      status: 'active',
    },
  })

  // Award onboarding XP
  await prisma.xpEvent.create({
    data: {
      userId,
      source: 'onboarding',
      amount: 100,
      metadata: { goal, experience, workStyle },
    },
  })

  // Initialize streak
  await prisma.streak.upsert({
    where: { userId_type: { userId, type: 'daily_focus' } },
    update: {},
    create: { userId, type: 'daily_focus', current: 0, longest: 0 },
  })

  return NextResponse.json({ success: true })
}
