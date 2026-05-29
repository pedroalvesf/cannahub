import {
  DiaryFollowUp as PrismaDiaryFollowUp,
  DiaryFollowUpSymptom as PrismaDiaryFollowUpSymptom,
  DiaryEffectLog as PrismaDiaryEffectLog,
  Prisma,
} from '@/generated/prisma/client'
import { DiaryFollowUp } from '@/domain/diary/enterprise/entities/diary-follow-up'
import { DiaryFollowUpSymptom } from '@/domain/diary/enterprise/entities/diary-follow-up-symptom'
import { DiaryEffectLog } from '@/domain/diary/enterprise/entities/diary-effect-log'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export type PrismaDiaryFollowUpWithRelations = PrismaDiaryFollowUp & {
  SymptomAssessments?: PrismaDiaryFollowUpSymptom[]
  Effects?: PrismaDiaryEffectLog[]
}

export class PrismaDiaryFollowUpMapper {
  static toDomain(raw: PrismaDiaryFollowUpWithRelations): DiaryFollowUp {
    const followUpId = new UniqueEntityID(raw.id)

    const assessments = (raw.SymptomAssessments ?? []).map((a) =>
      DiaryFollowUpSymptom.create(
        {
          followUpId,
          symptomLogId: new UniqueEntityID(a.symptomLogId),
          severityAfter: a.severityAfter,
        },
        new UniqueEntityID(a.id),
      ),
    )

    const effects = (raw.Effects ?? []).map((e) =>
      DiaryEffectLog.create(
        {
          followUpId,
          effectKey: e.effectKey,
          isPositive: e.isPositive,
          customEffectName: e.customEffectName ?? undefined,
        },
        new UniqueEntityID(e.id),
      ),
    )

    return DiaryFollowUp.create(
      {
        diaryEntryId: new UniqueEntityID(raw.diaryEntryId),
        evaluatedAt: raw.evaluatedAt,
        notes: raw.notes ?? undefined,
        tags: raw.tags,
        symptomAssessments: assessments,
        effects,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      followUpId,
    )
  }

  static toPrismaCreate(
    followUp: DiaryFollowUp,
  ): Prisma.DiaryFollowUpUncheckedCreateInput {
    return {
      id: followUp.id.toString(),
      diaryEntryId: followUp.diaryEntryId.toString(),
      evaluatedAt: followUp.evaluatedAt,
      notes: followUp.notes ?? null,
      tags: followUp.tags,
      createdAt: followUp.createdAt,
      SymptomAssessments: {
        create: followUp.symptomAssessments.map((a) => ({
          id: a.id.toString(),
          symptomLogId: a.symptomLogId.toString(),
          severityAfter: a.severityAfter,
        })),
      },
      Effects: {
        create: followUp.effects.map((e) => ({
          id: e.id.toString(),
          effectKey: e.effectKey,
          isPositive: e.isPositive,
          customEffectName: e.customEffectName ?? null,
        })),
      },
    }
  }
}
