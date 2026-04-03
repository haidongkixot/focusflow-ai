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

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const category = searchParams.get('category') || 'all'

    const where = category && category !== 'all' ? { category } : {}

    const [total, techniques] = await Promise.all([
      prisma.focusTechnique.count({ where }),
      prisma.focusTechnique.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
    ])

    return NextResponse.json({ techniques, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const technique = await prisma.focusTechnique.create({
      data: {
        name: body.name,
        slug: body.slug,
        category: body.category,
        description: body.description,
        instructions: body.instructions || [],
        durationMins: body.durationMins || 25,
        breakMins: body.breakMins || 5,
        cycles: body.cycles || 4,
        difficulty: body.difficulty || 'beginner',
        benefits: body.benefits || [],
        ambientSound: body.ambientSound || null,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder || 0,
      },
    })
    return NextResponse.json(technique, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const technique = await prisma.focusTechnique.update({ where: { id }, data })
    return NextResponse.json(technique)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await prisma.focusTechnique.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}
