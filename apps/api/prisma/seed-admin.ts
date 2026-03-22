/**
 * Seed script to create admin role, permissions, and optionally promote a user.
 *
 * Usage:
 *   npx tsx prisma/seed-admin.ts [email]
 *
 * If email is provided, that user gets the admin role.
 * If not, only the role and permissions are created.
 */
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Create admin role
  const role = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      slug: 'admin',
      description: 'Administrador com acesso ao painel de aprovação',
      level: 100,
    },
  })
  console.log(`Role: ${role.name} (${role.id})`)

  // 2. Create permissions
  const permissions = [
    { name: 'Admin Users Read', slug: 'admin_users:read', resource: 'admin_users', action: 'read' },
    { name: 'Admin Users Update', slug: 'admin_users:update', resource: 'admin_users', action: 'update' },
    { name: 'Admin Documents Read', slug: 'admin_documents:read', resource: 'admin_documents', action: 'read' },
    { name: 'Admin Documents Update', slug: 'admin_documents:update', resource: 'admin_documents', action: 'update' },
  ]

  for (const perm of permissions) {
    const permission = await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: {},
      create: perm,
    })

    // Link permission to role
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: role.id, permissionId: permission.id },
      },
      update: {},
      create: { roleId: role.id, permissionId: permission.id },
    })

    console.log(`  Permission: ${permission.slug}`)
  }

  // 3. Optionally assign to user
  const email = process.argv[2]
  if (email) {
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

    console.log(`\nAdmin role assigned to: ${email}`)
  } else {
    console.log('\nNo email provided. To promote a user, run:')
    console.log('  npx tsx prisma/seed-admin.ts admin@example.com')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
