/**
 * Seed script to create AMME Medicinal association + products.
 * Uses the same association ID as sample-associations.ts in the frontend.
 *
 * Usage:
 *   npx tsx prisma/seed-amme-products.ts
 */
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

const AMME_ID = 'a1b2c3d4-aaaa-4000-8000-000000000010'

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

const ammeProducts: ProductSeed[] = [
  // ─── Óleos CBD ─────────────────────────────────────────
  {
    name: 'Óleo de Cannabis CBD 10mg/ml',
    category: 'Óleo CBD', type: 'Óleo',
    description: 'Óleo CBD 1% em veículo TCM. Concentração inicial para titulação gradual. Aproximadamente 27 gotas/ml.',
    concentration: '10mg/ml (1%)', dosagePerDrop: '0,37mg/gota',
    cbd: 10, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 150 }],
  },
  {
    name: 'Óleo de Cannabis CBD 15mg/ml',
    category: 'Óleo CBD', type: 'Óleo',
    description: 'Óleo CBD 1,5% em veículo TCM. Para tratamentos de ansiedade e dor leve a moderada.',
    concentration: '15mg/ml (1,5%)', dosagePerDrop: '0,56mg/gota',
    cbd: 15, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 180 }],
  },
  {
    name: 'Óleo de Cannabis CBD 20mg/ml',
    category: 'Óleo CBD', type: 'Óleo',
    description: 'Óleo CBD 2% em veículo TCM. Concentração intermediária para doses moderadas.',
    concentration: '20mg/ml (2%)', dosagePerDrop: '0,74mg/gota',
    cbd: 20, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 210 }],
  },
  {
    name: 'Óleo de Cannabis CBD 30mg/ml',
    category: 'Óleo CBD', type: 'Óleo',
    description: 'Óleo CBD 3% em veículo TCM. Para pacientes com doses intermediárias já estabelecidas.',
    concentration: '30mg/ml (3%)', dosagePerDrop: '1,1mg/gota',
    cbd: 30, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 280 }],
  },
  {
    name: 'Óleo de Cannabis CBD 50mg/ml',
    category: 'Óleo CBD', type: 'Óleo',
    description: 'Óleo CBD 5% em veículo TCM. Alta concentração para protocolos que exigem doses elevadas.',
    concentration: '50mg/ml (5%)', dosagePerDrop: '1,85mg/gota',
    cbd: 50, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 380 }],
  },
  {
    name: 'Óleo de Cannabis CBD 60mg/ml',
    category: 'Óleo CBD', type: 'Óleo',
    description: 'Óleo CBD 6% em veículo TCM. Concentração elevada para tratamentos intensivos.',
    concentration: '60mg/ml (6%)', dosagePerDrop: '2,2mg/gota',
    cbd: 60, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 420 }],
  },
  {
    name: 'Óleo de Cannabis CBD 100mg/ml',
    category: 'Óleo CBD', type: 'Óleo',
    description: 'Óleo CBD 10% em veículo TCM. Máxima concentração disponível, para uso sob orientação médica rigorosa.',
    concentration: '100mg/ml (10%)', dosagePerDrop: '3,7mg/gota',
    cbd: 100, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 520 }],
  },

  // ─── Óleos THC ─────────────────────────────────────────
  {
    name: 'Óleo de Cannabis THC 10mg/ml',
    category: 'Óleo THC', type: 'Óleo',
    description: 'Óleo THC 1% em veículo TCM. Dose inicial para titulação controlada.',
    concentration: '10mg/ml (1%)', dosagePerDrop: '0,37mg/gota',
    cbd: 0, thc: 10, inStock: true,
    variants: [{ volume: '30ml', price: 150 }],
  },
  {
    name: 'Óleo de Cannabis THC 15mg/ml',
    category: 'Óleo THC', type: 'Óleo',
    description: 'Óleo THC 1,5% em veículo TCM. Para dor crônica e estimulação de apetite.',
    concentration: '15mg/ml (1,5%)', dosagePerDrop: '0,56mg/gota',
    cbd: 0, thc: 15, inStock: true,
    variants: [{ volume: '30ml', price: 180 }],
  },
  {
    name: 'Óleo de Cannabis THC 20mg/ml',
    category: 'Óleo THC', type: 'Óleo',
    description: 'Óleo THC 2% em veículo TCM. Concentração intermediária para pacientes com tolerância.',
    concentration: '20mg/ml (2%)', dosagePerDrop: '0,74mg/gota',
    cbd: 0, thc: 20, inStock: true,
    variants: [{ volume: '30ml', price: 210 }],
  },
  {
    name: 'Óleo de Cannabis THC 30mg/ml',
    category: 'Óleo THC', type: 'Óleo',
    description: 'Óleo THC 3% em veículo TCM. Para pacientes com doses intermediárias estabelecidas.',
    concentration: '30mg/ml (3%)', dosagePerDrop: '1,1mg/gota',
    cbd: 0, thc: 30, inStock: true,
    variants: [{ volume: '30ml', price: 280 }],
  },
  {
    name: 'Óleo de Cannabis THC 50mg/ml',
    category: 'Óleo THC', type: 'Óleo',
    description: 'Óleo THC 5% em veículo TCM. Alta concentração sob acompanhamento médico.',
    concentration: '50mg/ml (5%)', dosagePerDrop: '1,85mg/gota',
    cbd: 0, thc: 50, inStock: true,
    variants: [{ volume: '30ml', price: 380 }],
  },
  {
    name: 'Óleo de Cannabis THC 60mg/ml',
    category: 'Óleo THC', type: 'Óleo',
    description: 'Óleo THC 6% em veículo TCM. Concentração elevada para uso sob orientação rigorosa.',
    concentration: '60mg/ml (6%)', dosagePerDrop: '2,2mg/gota',
    cbd: 0, thc: 60, inStock: true,
    variants: [{ volume: '30ml', price: 420 }],
  },

  // ─── Óleos Mistos ──────────────────────────────────────
  {
    name: 'Óleo de Cannabis Misto 1:1 20mg/ml',
    category: 'Óleo Misto', type: 'Óleo',
    description: 'Óleo balanced THC:CBD 1:1, 2% em veículo TCM. Efeito entourage para dor e inflamação.',
    concentration: 'THC 20mg/ml + CBD 20mg/ml (2%)', dosagePerDrop: '0,74mg/gota cada',
    cbd: 20, thc: 20, inStock: true,
    variants: [{ volume: '30ml', price: 230 }],
  },
  {
    name: 'Óleo de Cannabis Misto 1:1 30mg/ml',
    category: 'Óleo Misto', type: 'Óleo',
    description: 'Óleo balanced THC:CBD 1:1, 3% em veículo TCM. Para tratamentos combinados com dose intermediária.',
    concentration: 'THC 30mg/ml + CBD 30mg/ml (3%)', dosagePerDrop: '1,1mg/gota cada',
    cbd: 30, thc: 30, inStock: true,
    variants: [{ volume: '30ml', price: 320 }],
  },
  {
    name: 'Óleo de Cannabis Misto 1:1 60mg/ml',
    category: 'Óleo Misto', type: 'Óleo',
    description: 'Óleo balanced THC:CBD 1:1, 6% em veículo TCM. Alta concentração para doses elevadas.',
    concentration: 'THC 60mg/ml + CBD 60mg/ml (6%)', dosagePerDrop: '2,2mg/gota cada',
    cbd: 60, thc: 60, inStock: true,
    variants: [{ volume: '30ml', price: 480 }],
  },

  // ─── Óleos Especiais ───────────────────────────────────
  {
    name: 'Óleo CBD + CBN + CBG',
    category: 'Óleo Especial', type: 'Óleo',
    description: 'Fórmula exclusiva com três canabinoides: CBD 60mg/ml, CBN 20mg/ml e CBG 20mg/ml em veículo TCM. Indicado para distúrbios do sono e dor com componente inflamatório.',
    concentration: 'CBD 60mg/ml + CBN 20mg/ml + CBG 20mg/ml', dosagePerDrop: '3,7mg/gota (total)',
    cbd: 60, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 490 }],
  },
  {
    name: 'Óleo CBG + CBD 1:1',
    category: 'Óleo Especial', type: 'Óleo',
    description: 'Óleo com CBG 30mg/ml e CBD 30mg/ml em proporção 1:1, veículo TCM. O CBG (canabigerol) é precursor de outros canabinoides com propriedades anti-inflamatórias e neuroprotetoras.',
    concentration: 'CBG 30mg/ml + CBD 30mg/ml', dosagePerDrop: '2,2mg/gota (total)',
    cbd: 30, thc: 0, inStock: true,
    variants: [{ volume: '30ml', price: 350 }],
  },
]

async function main() {
  // Ensure association exists — create if not
  let association = await prisma.association.findUnique({ where: { id: AMME_ID } })

  if (!association) {
    association = await prisma.association.create({
      data: {
        id: AMME_ID,
        name: 'AMME Medicinal',
        cnpj: '98765432000199',
        status: 'verified',
        description: 'Associação fundada em 2019 em Recife, especializada em óleos de cannabis com ampla variedade de concentrações CBD, THC e fórmulas especiais com CBN e CBG. Envio para todo o Brasil.',
        region: 'Nordeste',
        state: 'PE',
        city: 'Recife',
        profileTypes: ['patient', 'guardian', 'caregiver'],
        hasAssistedAccess: false,
        contactEmail: 'contato@ammemedicinal.org',
        contactPhone: '(81) 9 9604-0269',
        website: 'https://ammemedicinal.org',
        membershipFee: 250,
        membershipPeriod: 'annual',
        membershipDescription: 'Anuidade que cobre custos operacionais e acesso ao catálogo completo.',
      },
    })
    console.log(`Created association: ${association.name}`)
  } else {
    console.log(`Association already exists: ${association.name}`)
  }

  // Clean existing products
  await prisma.productVariant.deleteMany({
    where: { Product: { associationId: AMME_ID } },
  })
  await prisma.product.deleteMany({ where: { associationId: AMME_ID } })
  console.log('Cleaned existing products')

  for (const p of ammeProducts) {
    const product = await prisma.product.create({
      data: {
        associationId: AMME_ID,
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

  console.log(`\n${ammeProducts.length} produtos criados para ${association.name}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
