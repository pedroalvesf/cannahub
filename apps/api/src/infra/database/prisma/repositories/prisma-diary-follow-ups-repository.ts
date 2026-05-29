import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DiaryFollowUpsRepository } from '@/domain/diary/application/repositories/diary-follow-ups-repository'
import { DiaryFollowUp } from '@/domain/diary/enterprise/entities/diary-follow-up'
import { PrismaDiaryFollowUpMapper } from '../mappers/prisma-diary-follow-up-mapper'

const INCLUDE_RELATIONS = {
  SymptomAssessments: true,
  Effects: true,
} as const

@Injectable()
export class PrismaDiaryFollowUpsRepository implements DiaryFollowUpsRepository {
  constructor(private prisma: PrismaService) {}

  async create(followUp: DiaryFollowUp): Promise<void> {
    const data = PrismaDiaryFollowUpMapper.toPrismaCreate(followUp)
    await this.prisma.diaryFollowUp.create({ data })
  }

  async findById(id: string): Promise<DiaryFollowUp | null> {
    const raw = await this.prisma.diaryFollowUp.findUnique({
      where: { id },
      include: INCLUDE_RELATIONS,
    })
    return raw ? PrismaDiaryFollowUpMapper.toDomain(raw) : null
  }

  async findManyByEntryId(entryId: string): Promise<DiaryFollowUp[]> {
    const raws = await this.prisma.diaryFollowUp.findMany({
      where: { diaryEntryId: entryId },
      include: INCLUDE_RELATIONS,
      orderBy: { evaluatedAt: 'asc' },
    })
    return raws.map(PrismaDiaryFollowUpMapper.toDomain)
  }

  async update(followUp: DiaryFollowUp): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.diaryFollowUp.update({
        where: { id: followUp.id.toString() },
        data: {
          evaluatedAt: followUp.evaluatedAt,
          notes: followUp.notes ?? null,
          tags: followUp.tags,
          updatedAt: followUp.updatedAt,
        },
      })

      // Replace symptom assessments
      await tx.diaryFollowUpSymptom.deleteMany({
        where: { followUpId: followUp.id.toString() },
      })
      if (followUp.symptomAssessments.length > 0) {
        await tx.diaryFollowUpSymptom.createMany({
          data: followUp.symptomAssessments.map((a) => ({
            id: a.id.toString(),
            followUpId: followUp.id.toString(),
            symptomLogId: a.symptomLogId.toString(),
            severityAfter: a.severityAfter,
          })),
        })
      }

      // Replace effects
      await tx.diaryEffectLog.deleteMany({
        where: { followUpId: followUp.id.toString() },
      })
      if (followUp.effects.length > 0) {
        await tx.diaryEffectLog.createMany({
          data: followUp.effects.map((e) => ({
            id: e.id.toString(),
            followUpId: followUp.id.toString(),
            effectKey: e.effectKey,
            isPositive: e.isPositive,
            customEffectName: e.customEffectName ?? null,
          })),
        })
      }
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.diaryFollowUp.delete({ where: { id } })
  }
}
