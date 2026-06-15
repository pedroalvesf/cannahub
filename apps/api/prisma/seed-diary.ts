/**
 * Seed script: populates a treatment diary for a demo patient.
 * Creates ~5 entries over the last ~12 days with symptoms (severity 0-10),
 * multiple follow-ups (severity after), effects, tags and one favorite —
 * enough data to exercise the timeline and the Insights charts.
 *
 * Usage:
 *   npx tsx prisma/seed-diary.ts
 */
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const PATIENT_EMAIL = 'paciente@teste.com'
const PATIENT_PASSWORD = 'abc123'

interface FollowUpSeed {
  hoursAfter: number
  notes?: string
  tags?: string[]
  after: Record<string, number> // symptomKey -> severityAfter (0-10)
  effects?: Array<{ key: string; positive: boolean }>
}

interface EntrySeed {
  days: number // days ago
  time: string
  product: string
  method: string
  dose: number
  unit: string
  condition?: string
  notes?: string
  symptoms: Array<{ key: string; before: number }>
  followUps: FollowUpSeed[]
}

const ENTRIES: EntrySeed[] = [
  {
    days: 12, time: '08:00', product: 'Óleo CBD 30mg/ml', method: 'oil', dose: 3, unit: 'drops',
    condition: 'anxiety', notes: 'Primeira semana de tratamento.',
    symptoms: [{ key: 'anxiety', before: 8 }, { key: 'insomnia', before: 7 }],
    followUps: [
      { hoursAfter: 2, after: { anxiety: 6 }, tags: ['as_expected'], effects: [{ key: 'relaxed', positive: true }] },
      { hoursAfter: 14, notes: 'Dormi melhor que o normal.', after: { insomnia: 4 }, tags: ['slept_well'], effects: [{ key: 'sleepy', positive: true }] },
    ],
  },
  {
    days: 9, time: '21:30', product: 'Óleo CBD 30mg/ml', method: 'oil', dose: 4, unit: 'drops',
    condition: 'insomnia', notes: 'Aumentei a dose para dormir.',
    symptoms: [{ key: 'insomnia', before: 6 }],
    followUps: [
      { hoursAfter: 10, notes: 'Acordei descansado.', after: { insomnia: 2 }, tags: ['slept_deep', 'woke_up_rested'], effects: [{ key: 'sleepy', positive: true }] },
    ],
  },
  {
    days: 6, time: '08:30', product: 'Óleo CBD 30mg/ml', method: 'oil', dose: 4, unit: 'drops',
    condition: 'anxiety', notes: 'Dia de trabalho intenso.',
    symptoms: [{ key: 'anxiety', before: 6 }, { key: 'stress', before: 7 }],
    followUps: [
      { hoursAfter: 3, after: { anxiety: 3, stress: 4 }, tags: ['better_than_expected'], effects: [{ key: 'calm', positive: true }, { key: 'focused', positive: true }] },
    ],
  },
  {
    days: 3, time: '12:00', product: 'Flor Charlotte (vaporizada)', method: 'vape', dose: 2, unit: 'puffs',
    condition: 'chronic_pain', notes: 'Dor nas costas após exercício.',
    symptoms: [{ key: 'pain', before: 7 }, { key: 'inflammation', before: 5 }],
    followUps: [
      { hoursAfter: 1, after: { pain: 4, inflammation: 3 }, tags: ['as_expected'], effects: [{ key: 'pain_relief', positive: true }, { key: 'dry_mouth', positive: false }] },
    ],
  },
  {
    days: 1, time: '08:00', product: 'Óleo CBD 30mg/ml', method: 'oil', dose: 4, unit: 'drops',
    condition: 'anxiety', notes: 'Me sentindo mais estável.',
    symptoms: [{ key: 'anxiety', before: 4 }, { key: 'insomnia', before: 3 }],
    followUps: [
      { hoursAfter: 2, after: { anxiety: 2 }, tags: ['better_than_expected'], effects: [{ key: 'relaxed', positive: true }] },
    ],
  },
]

function dateDaysAgo(days: number, time: string) {
  const [h, m] = time.split(':').map(Number)
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  d.setUTCHours(h ?? 0, m ?? 0, 0, 0)
  return d
}

async function getOrCreatePatient() {
  const existing = await prisma.user.findUnique({ where: { email: PATIENT_EMAIL } })
  if (existing) return existing

  return prisma.user.create({
    data: {
      email: PATIENT_EMAIL,
      password: await bcrypt.hash(PATIENT_PASSWORD, 10),
      name: 'Paciente Demo',
      accountType: 'patient',
      accountStatus: 'approved',
      onboardingStatus: 'completed',
      documentsStatus: 'approved',
    },
  })
}

async function main() {
  const user = await getOrCreatePatient()

  // Idempotent: wipe this user's diary before reseeding (children cascade)
  await prisma.diaryEntry.deleteMany({ where: { userId: user.id } })
  await prisma.diaryFavorite.deleteMany({ where: { userId: user.id } })

  let entryCount = 0
  let followUpCount = 0

  for (const e of ENTRIES) {
    const date = dateDaysAgo(e.days, e.time)

    const created = await prisma.diaryEntry.create({
      data: {
        userId: user.id,
        date,
        time: e.time,
        customProductName: e.product,
        administrationMethod: e.method,
        doseAmount: e.dose,
        doseUnit: e.unit,
        targetCondition: e.condition,
        notes: e.notes,
        Symptoms: {
          create: e.symptoms.map((s) => ({
            symptomKey: s.key,
            severityBefore: s.before,
          })),
        },
      },
      include: { Symptoms: true },
    })
    entryCount++

    const symptomIdByKey = new Map(
      created.Symptoms.map((s) => [s.symptomKey, s.id]),
    )

    for (const f of e.followUps) {
      await prisma.diaryFollowUp.create({
        data: {
          diaryEntryId: created.id,
          evaluatedAt: new Date(date.getTime() + f.hoursAfter * 60 * 60 * 1000),
          notes: f.notes,
          tags: f.tags ?? [],
          SymptomAssessments: {
            create: Object.entries(f.after)
              .filter(([key]) => symptomIdByKey.has(key))
              .map(([key, severityAfter]) => ({
                symptomLogId: symptomIdByKey.get(key)!,
                severityAfter,
              })),
          },
          Effects: {
            create: (f.effects ?? []).map((ef) => ({
              effectKey: ef.key,
              isPositive: ef.positive,
            })),
          },
        },
      })
      followUpCount++
    }
  }

  await prisma.diaryFavorite.create({
    data: {
      userId: user.id,
      name: 'Óleo CBD — manhã',
      customProductName: 'Óleo CBD 30mg/ml',
      administrationMethod: 'oil',
      doseAmount: 4,
      doseUnit: 'drops',
      symptomKeys: ['anxiety', 'insomnia'],
    },
  })

  console.log(`✓ Diário populado para ${PATIENT_EMAIL} (senha: ${PATIENT_PASSWORD})`)
  console.log(`  ${entryCount} entradas, ${followUpCount} follow-ups, 1 favorito`)
}

main()
  .catch((err) => {
    console.error('Erro ao popular o diário:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
