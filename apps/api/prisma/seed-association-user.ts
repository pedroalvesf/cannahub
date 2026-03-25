/**
 * Seed script to create association role, permissions, and optionally promote a user.
 *
 * Usage:
 *   npx tsx prisma/seed-association-user.ts [email] [associationId]
 *
 * If email + associationId are provided, that user gets the association role
 * and is linked as a member (director) of that association.
 *
 * If no arguments, creates a test association + user + member link.
 */
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Create association role
  const role = await prisma.role.upsert({
    where: { slug: 'association' },
    update: {},
    create: {
      name: 'Association',
      slug: 'association',
      description: 'Membro de associação com acesso ao painel de gestão',
      level: 50,
    },
  })
  console.log(`Role: ${role.name} (${role.id})`)

  // 2. Create permissions
  const permissions = [
    { name: 'Association Catalog Read', slug: 'association_catalog:read', resource: 'association_catalog', action: 'read' },
    { name: 'Association Catalog Create', slug: 'association_catalog:create', resource: 'association_catalog', action: 'create' },
    { name: 'Association Catalog Update', slug: 'association_catalog:update', resource: 'association_catalog', action: 'update' },
    { name: 'Association Catalog Delete', slug: 'association_catalog:delete', resource: 'association_catalog', action: 'delete' },
    { name: 'Association Members Read', slug: 'association_members:read', resource: 'association_members', action: 'read' },
    { name: 'Association Members Update', slug: 'association_members:update', resource: 'association_members', action: 'update' },
    { name: 'Association Profile Read', slug: 'association_profile:read', resource: 'association_profile', action: 'read' },
    { name: 'Association Profile Update', slug: 'association_profile:update', resource: 'association_profile', action: 'update' },
  ]

  for (const perm of permissions) {
    const permission = await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: {},
      create: perm,
    })

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: role.id, permissionId: permission.id },
      },
      update: {},
      create: { roleId: role.id, permissionId: permission.id },
    })

    console.log(`  Permission: ${permission.slug}`)
  }

  // 3. Promote existing user or create test setup
  const email = process.argv[2]
  const associationId = process.argv[3]

  if (email && associationId) {
    // Promote existing user and link to existing association
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.error(`User not found: ${email}`)
      process.exit(1)
    }

    const association = await prisma.association.findUnique({ where: { id: associationId } })
    if (!association) {
      console.error(`Association not found: ${associationId}`)
      process.exit(1)
    }

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id },
    })

    await prisma.associationMember.upsert({
      where: { associationId_userId: { associationId: association.id, userId: user.id } },
      update: { role: 'director' },
      create: { associationId: association.id, userId: user.id, role: 'director', status: 'active' },
    })

    console.log(`\nAssociation role assigned to: ${email}`)
    console.log(`Linked as director of: ${association.name}`)
  } else if (email) {
    // Just assign role, no association link
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.error(`User not found: ${email}`)
      process.exit(1)
    }

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id },
    })

    console.log(`\nAssociation role assigned to: ${email}`)
    console.log('Note: user not linked to any association yet. Run with associationId to link.')
  } else {
    // Create test association + user + member
    const hashedPassword = await bcrypt.hash('abc123', 10)

    const user = await prisma.user.upsert({
      where: { email: 'associacaoalianca@teste.com' },
      update: {},
      create: {
        email: 'associacaoalianca@teste.com',
        password: hashedPassword,
        name: 'Gestor Aliança Medicinal',
        accountType: 'patient',
        accountStatus: 'approved',
        onboardingStatus: 'completed',
        documentsStatus: 'approved',
        verificationStatus: 'verified',
      },
    })
    console.log(`\nUser created: ${user.id} (${user.email})`)

    const association = await prisma.association.upsert({
      where: { cnpj: '12345678000101' },
      update: {},
      create: {
        name: 'Aliança Medicinal',
        cnpj: '12345678000101',
        status: 'verified',
        description: 'Associação referência em cannabis medicinal no Nordeste. Cultivo autorizado pela justiça, laboratório próprio e acompanhamento multidisciplinar.',
        region: 'Nordeste',
        state: 'PE',
        city: 'Recife',
        profileTypes: ['patient', 'guardian', 'caregiver'],
        hasAssistedAccess: true,
        contactEmail: 'contato@aliancamedicinal.org.br',
        contactPhone: '(81) 3333-4444',
        website: 'https://aliancamedicinal.org.br',
        membershipFee: 300,
        membershipPeriod: 'annual',
        membershipDescription: 'Anuidade que cobre custos de manutenção, laboratório e acompanhamento.',
      },
    })
    console.log(`Association created: ${association.id} (${association.name})`)

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id },
    })

    await prisma.associationMember.upsert({
      where: { associationId_userId: { associationId: association.id, userId: user.id } },
      update: { role: 'director' },
      create: { associationId: association.id, userId: user.id, role: 'director', status: 'active' },
    })

    console.log(`Member link created: ${user.email} → ${association.name} (director)`)
    console.log(`\nLogin: associacaoalianca@teste.com / abc123`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
