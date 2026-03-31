import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'admin') throw new Error('Unauthorized')
  return session
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        tasks: { orderBy: { createdAt: 'desc' }, take: 10 },
        focusSessions: {
          orderBy: { startedAt: 'desc' },
          take: 20,
          include: { task: { select: { title: true } } },
        },
        achievements: { orderBy: { earnedAt: 'desc' } },
      },
    })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const completedSessions = user.focusSessions.filter((s) => s.completed).length
    const totalMins = user.focusSessions.reduce((acc, s) => acc + (s.actualMins ?? 0), 0)
    const doneTasks = user.tasks.filter((t) => t.status === 'done').length

    return NextResponse.json({ ...user, stats: { completedSessions, totalMins, doneTasks } })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await prisma.user.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
