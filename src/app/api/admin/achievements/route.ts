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

    const achievements = await prisma.userAchievement.findMany({
      orderBy: { earnedAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json({ achievements, total: achievements.length })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
