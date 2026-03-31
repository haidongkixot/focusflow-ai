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
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const pageSize = 25

    const where: Record<string, unknown> = {}
    if (status && status !== 'all') where.status = status
    if (priority && priority !== 'all') where.priority = priority

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.task.count({ where }),
    ])

    return NextResponse.json({
      tasks,
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
