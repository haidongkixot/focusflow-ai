#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@focusflow.ai'
  const password = process.argv[3] || 'admin123!'
  const name = process.argv[4] || 'Admin'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
    })
    console.log(`Updated ${email} to admin role`)
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, name, passwordHash: hashed, role: 'admin' },
  })
  console.log(`Created admin: ${user.email}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
