import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding FocusFlow AI...')

  // Admin user
  const adminPassword = await bcrypt.hash('admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@focusflow.ai' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@focusflow.ai',
      passwordHash: adminPassword,
      role: 'admin',
    },
  })
  console.log('Admin:', admin.email)

  // Demo user
  const demoPassword = await bcrypt.hash('demo1234', 12)
  const demo = await prisma.user.upsert({
    where: { email: 'demo@focusflow.ai' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@focusflow.ai',
      passwordHash: demoPassword,
    },
  })
  console.log('Demo user:', demo.email)

  // Demo tasks
  const tasks = await Promise.all([
    prisma.task.upsert({
      where: { id: 'demo-task-1' },
      update: {},
      create: {
        id: 'demo-task-1',
        userId: demo.id,
        title: 'Review quarterly goals',
        priority: 'high',
        status: 'todo',
        category: 'Work',
        estimatedMins: 25,
      },
    }),
    prisma.task.upsert({
      where: { id: 'demo-task-2' },
      update: {},
      create: {
        id: 'demo-task-2',
        userId: demo.id,
        title: 'Read Deep Work by Cal Newport',
        priority: 'medium',
        status: 'in_progress',
        category: 'Learning',
        estimatedMins: 50,
        focusSessionCount: 2,
      },
    }),
    prisma.task.upsert({
      where: { id: 'demo-task-3' },
      update: {},
      create: {
        id: 'demo-task-3',
        userId: demo.id,
        title: 'Set up weekly review template',
        priority: 'low',
        status: 'done',
        category: 'Personal',
        estimatedMins: 25,
        completedAt: new Date(),
        focusSessionCount: 1,
      },
    }),
  ])
  console.log('Tasks created:', tasks.length)

  // Demo focus sessions
  const now = new Date()
  const sessions = await Promise.all(
    Array.from({ length: 5 }).map((_, i) => {
      const start = new Date(now.getTime() - (i + 1) * 30 * 60 * 1000)
      return prisma.focusSession.upsert({
        where: { id: `demo-session-${i}` },
        update: {},
        create: {
          id: `demo-session-${i}`,
          userId: demo.id,
          taskId: i < 2 ? 'demo-task-2' : undefined,
          type: i % 4 === 3 ? 'short_break' : 'focus',
          durationMins: i % 4 === 3 ? 5 : 25,
          actualMins: i % 4 === 3 ? 5 : 25,
          completed: true,
          startedAt: start,
          endedAt: new Date(start.getTime() + (i % 4 === 3 ? 5 : 25) * 60 * 1000),
        },
      })
    })
  )
  console.log('Focus sessions created:', sessions.length)

  // Achievement
  await prisma.userAchievement.upsert({
    where: { userId_type_name: { userId: demo.id, type: 'sessions', name: '1_sessions' } },
    update: {},
    create: {
      userId: demo.id,
      type: 'sessions',
      name: '1_sessions',
      description: 'Completed first focus session',
    },
  })

  console.log('Seed complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
