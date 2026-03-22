import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash('abc123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'adm@teste.com' },
    update: {},
    create: {
      email: 'adm@teste.com',
      password: hashedPassword,
      name: 'Administrador',
      accountType: 'patient',
      accountStatus: 'approved',
      onboardingStatus: 'completed',
      documentsStatus: 'approved',
      verificationStatus: 'verified',
    },
  })
  console.log('User created:', user.id, user.email)

  // Create admin role
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
  console.log('Role:', role.name, role.id)

  // Create permissions
  const perms = [
    { name: 'Admin Users Read', slug: 'admin_users:read', resource: 'admin_users', action: 'read' },
    { name: 'Admin Users Update', slug: 'admin_users:update', resource: 'admin_users', action: 'update' },
    { name: 'Admin Documents Read', slug: 'admin_documents:read', resource: 'admin_documents', action: 'read' },
    { name: 'Admin Documents Update', slug: 'admin_documents:update', resource: 'admin_documents', action: 'update' },
  ]

  for (const p of perms) {
    const perm = await prisma.permission.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
      update: {},
      create: { roleId: role.id, permissionId: perm.id },
    })
    console.log('  Permission:', perm.slug)
  }

  // Assign role to user
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  })
  console.log('\nAdmin role assigned to:', user.email)
  console.log('Login: adm@teste.com / abc123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
