import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getLevelFromXp } from '@/lib/gamification'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  try {
    const [xpResult, streak] = await Promise.all([
      prisma.xpEvent.aggregate({ where: { userId }, _sum: { amount: true } }),
      prisma.streak.findFirst({ where: { userId, type: 'daily_focus' } }),
    ])
    const totalXp = xpResult._sum.amount ?? 0
    const lvlInfo = getLevelFromXp(totalXp)
    return NextResponse.json({
      xp: totalXp,
      level: lvlInfo.level,
      xpInCurrentLevel: lvlInfo.currentXp,
      xpForNextLevel: lvlInfo.nextLevelXp,
      progressPercent: Math.round((lvlInfo.currentXp / lvlInfo.nextLevelXp) * 100),
      currentStreak: streak?.current ?? 0,
      longestStreak: streak?.longest ?? 0,
    })
  } catch (err) {
    console.error('[gamification]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
