import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role')

    const where: Record<string, unknown> = {}
    if (role && role !== 'all') where.role = role

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { tasks: true, focusSessions: true },
        },
      },
    })

    return NextResponse.json({ users })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const { id, role } = body

    if (!id || !role) {
      return NextResponse.json({ error: 'id and role are required' }, { status: 400 })
    }

    if (!['admin', 'user'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true },
    })

    return NextResponse.json({ user: updated })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
