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
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const type = searchParams.get('type')
    const completed = searchParams.get('completed')
    const pageSize = 25

    const where: Record<string, unknown> = {}
    if (type && type !== 'all') where.type = type
    if (completed === 'true') where.completed = true
    if (completed === 'false') where.completed = false

    const [sessions, total] = await Promise.all([
      prisma.focusSession.findMany({
        where,
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: { select: { name: true, email: true } },
          task: { select: { title: true } },
        },
      }),
      prisma.focusSession.count({ where }),
    ])

    return NextResponse.json({
      sessions,
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
