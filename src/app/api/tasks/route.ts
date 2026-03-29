import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  category: z.string().optional(),
  estimatedMins: z.number().int().min(1).max(480).optional(),
  dueDate: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      ...(status ? { status } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.data }, { status: 400 })
  }

  const { title, description, priority, category, estimatedMins, dueDate } = parsed.data

  const task = await prisma.task.create({
    data: {
      userId: session.user.id,
      title,
      description,
      priority,
      category,
      estimatedMins,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  })

  return NextResponse.json(task, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...updates } = body

  const task = await prisma.task.findFirst({ where: { id, userId: session.user.id } })
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.task.update({
    where: { id },
    data: {
      ...updates,
      completedAt: updates.status === 'done' ? new Date() : updates.status ? null : undefined,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const task = await prisma.task.findFirst({ where: { id, userId: session.user.id } })
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.task.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
