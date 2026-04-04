import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
async function main() {
  const result = await p.$queryRawUnsafe('SELECT 1 as x')
  console.log('Database is awake:', result)
}
main().catch(e => console.error('Failed:', e.message)).finally(() => p.$disconnect())
