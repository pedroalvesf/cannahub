/**
 * Seed script to create AMME Medicinal association user.
 * Creates user admamme@teste.com, assigns association role,
 * and links as director of AMME Medicinal.
 *
 * Usage:
 *   npx tsx prisma/seed-amme-user.ts
 */
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

const AMME_ID = 'a1b2c3d4-aaaa-4000-8000-000000000010'

async function main() {
  // Verify association exists
  const association = await prisma.association.findUnique({ where: { id: AMME_ID } })
  if (!association) {
    console.error(`Association ${AMME_ID} not found. Run seed-amme-products.ts first.`)
    process.exit(1)
  }

  // Ensure association role exists
  const role = await prisma.role.findUnique({ where: { slug: 'association' } })
  if (!role) {
    console.error('Association role not found. Run seed-association-user.ts first.')
    process.exit(1)
  }

  // Create user
  const hashedPassword = await bcrypt.hash('abc123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admamme@teste.com' },
    update: {},
    create: {
      email: 'admamme@teste.com',
      password: hashedPassword,
      name: 'Gestor AMME Medicinal',
      accountType: 'patient',
      accountStatus: 'approved',
      onboardingStatus: 'completed',
      documentsStatus: 'approved',
      verificationStatus: 'verified',
    },
  })
  console.log(`User: ${user.email} (${user.id})`)

  // Assign association role
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  })
  console.log(`Role assigned: association`)

  // Link as director
  await prisma.associationMember.upsert({
    where: { associationId_userId: { associationId: AMME_ID, userId: user.id } },
    update: { role: 'director' },
    create: { associationId: AMME_ID, userId: user.id, role: 'director', status: 'active' },
  })
  console.log(`Linked as director of: ${association.name}`)

  console.log(`\nLogin: admamme@teste.com / abc123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
