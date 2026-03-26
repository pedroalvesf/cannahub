/**
 * Seed script to create products for Aliança Medicinal.
 * Uses the same association ID as sample-associations.ts in the frontend.
 *
 * Usage:
 *   npx tsx prisma/seed-products.ts
 */
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

const ALIANCA_ID = 'a1b2c3d4-9999-4000-8000-000000000009'

interface ProductSeed {
  name: string
  category: string
  type: string
  description: string
  concentration: string
  dosagePerDrop?: string
  cbd: number
  thc: number
  inStock: boolean
  variants: Array<{ volume: string; price: number }>
}

const aliancaProducts: ProductSeed[] = [
  // Óleos CBD
  {
    name: 'Óleo de Cannabis CBD 15mg/ml',
    category: 'Óleo CBD', type: 'Óleo',
    description: 'Óleo full spectrum rico em CBD. Indicado para ansiedade, dor crônica e epilepsia.',
    concentration: '15mg/ml', dosagePerDrop: '0,5mg/gota',
    cbd: 15, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 170 }, { volume: '10ml', price: 80 }],
  },
  {
    name: 'Óleo de Cannabis CBD 30mg/ml',
    category: 'Óleo CBD', type: 'Óleo',
    description: 'Óleo full spectrum com concentração intermediária de CBD. Para tratamentos que necessitam de doses maiores.',
    concentration: '30mg/ml', dosagePerDrop: '1mg/gota',
    cbd: 30, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 280 }, { volume: '10ml', price: 110 }],
  },
  {
    name: 'Óleo de Cannabis CBD 60mg/ml',
    category: 'Óleo CBD', type: 'Óleo',
    description: 'Óleo full spectrum de alta concentração CBD. Para pacientes com doses elevadas já estabelecidas.',
    concentration: '60mg/ml', dosagePerDrop: '2mg/gota',
    cbd: 60, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 405 }, { volume: '10ml', price: 160 }],
  },
  {
    name: 'Óleo de Cannabis CBD 100mg/ml',
    category: 'Óleo CBD', type: 'Óleo',
    description: 'Máxima concentração de CBD disponível. Para tratamentos intensivos sob orientação médica.',
    concentration: '100mg/ml', dosagePerDrop: '3,33mg/gota',
    cbd: 100, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 490 }, { volume: '10ml', price: 200 }],
  },
  // Óleos THC
  {
    name: 'Óleo de Cannabis THC 15mg/ml',
    category: 'Óleo THC', type: 'Óleo',
    description: 'Óleo full spectrum rico em THC. Indicado para dor, náusea, espasmos e estimulação de apetite.',
    concentration: '15mg/ml', dosagePerDrop: '0,5mg/gota',
    cbd: 0, thc: 15, inStock: true,
    variants: [{ volume: '30ml', price: 170 }, { volume: '10ml', price: 80 }],
  },
  {
    name: 'Óleo de Cannabis THC 30mg/ml',
    category: 'Óleo THC', type: 'Óleo',
    description: 'Óleo full spectrum com concentração intermediária de THC. Para pacientes com tolerância moderada.',
    concentration: '30mg/ml', dosagePerDrop: '1mg/gota',
    cbd: 0, thc: 30, inStock: true,
    variants: [{ volume: '30ml', price: 280 }, { volume: '10ml', price: 110 }],
  },
  {
    name: 'Óleo de Cannabis THC 60mg/ml',
    category: 'Óleo THC', type: 'Óleo',
    description: 'Óleo full spectrum de alta concentração THC. Uso sob acompanhamento médico rigoroso.',
    concentration: '60mg/ml', dosagePerDrop: '2mg/gota',
    cbd: 0, thc: 60, inStock: true,
    variants: [{ volume: '30ml', price: 405 }, { volume: '10ml', price: 160 }],
  },
  // Óleos Mistos
  {
    name: 'Óleo de Cannabis Misto 7,5mg/ml',
    category: 'Óleo Misto', type: 'Óleo',
    description: 'Óleo balanced 1:1 com THC e CBD em proporções iguais. Efeito sinérgico para dor e inflamação.',
    concentration: 'THC 7,5mg/ml + CBD 7,5mg/ml', dosagePerDrop: '0,25mg/gota cada',
    cbd: 7.5, thc: 7.5, inStock: true,
    variants: [{ volume: '30ml', price: 170 }],
  },
  {
    name: 'Óleo de Cannabis Misto 15mg/ml',
    category: 'Óleo Misto', type: 'Óleo',
    description: 'Óleo balanced 1:1 com THC 15mg/ml e CBD 15mg/ml. Efeito entourage para tratamentos combinados.',
    concentration: 'THC 15mg/ml + CBD 15mg/ml', dosagePerDrop: '0,5mg/gota cada',
    cbd: 15, thc: 15, inStock: true,
    variants: [{ volume: '30ml', price: 280 }, { volume: '10ml', price: 110 }],
  },
  {
    name: 'Óleo de Cannabis Misto 30mg/ml',
    category: 'Óleo Misto', type: 'Óleo',
    description: 'Óleo balanced 1:1 com THC 30mg/ml e CBD 30mg/ml. Alta concentração para doses maiores.',
    concentration: 'THC 30mg/ml + CBD 30mg/ml', dosagePerDrop: '1mg/gota cada',
    cbd: 30, thc: 30, inStock: true,
    variants: [{ volume: '30ml', price: 405 }, { volume: '10ml', price: 160 }],
  },
  // Tópicos
  {
    name: 'Pomada Rica em THC 2%',
    category: 'Pomada', type: 'Tópico',
    description: 'Pomada de THC 2% (20mg/g) para aplicação tópica. Indicada para dores musculares, articulares e inflamações localizadas.',
    concentration: 'THC 20mg/g (2%)',
    cbd: 0, thc: 20, inStock: true,
    variants: [{ volume: '30g', price: 95 }],
  },
  {
    name: 'Creme de Extrato de Cannabis Sativa',
    category: 'Creme', type: 'Tópico',
    description: 'Creme com extrato balanceado de THC e CBD (15mg/g cada). Para dores localizadas com efeito anti-inflamatório.',
    concentration: 'THC 15mg/g + CBD 15mg/g',
    cbd: 15, thc: 15, inStock: true,
    variants: [{ volume: '30g', price: 110 }],
  },
]

async function main() {
  // Verify association exists
  const association = await prisma.association.findUnique({ where: { id: ALIANCA_ID } })
  if (!association) {
    console.error(`Association ${ALIANCA_ID} not found. Run seed-association-user.ts first.`)
    process.exit(1)
  }

  console.log(`Seeding products for: ${association.name}`)

  // Clean existing products for this association
  await prisma.productVariant.deleteMany({
    where: { Product: { associationId: ALIANCA_ID } },
  })
  await prisma.product.deleteMany({ where: { associationId: ALIANCA_ID } })
  console.log('Cleaned existing products')

  for (const p of aliancaProducts) {
    const product = await prisma.product.create({
      data: {
        associationId: ALIANCA_ID,
        name: p.name,
        category: p.category,
        type: p.type,
        description: p.description,
        concentration: p.concentration,
        dosagePerDrop: p.dosagePerDrop,
        cbd: p.cbd,
        thc: p.thc,
        inStock: p.inStock,
        Variants: {
          create: p.variants.map((v) => ({
            volume: v.volume,
            price: v.price,
          })),
        },
      },
    })
    console.log(`  ${product.name} (${p.variants.length} variantes)`)
  }

  console.log(`\n${aliancaProducts.length} produtos criados para ${association.name}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
