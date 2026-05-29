import {
  DiaryEntry as PrismaDiaryEntry,
  DiarySymptomLog as PrismaDiarySymptomLog,
  DiaryFollowUp as PrismaDiaryFollowUp,
  DiaryFollowUpSymptom as PrismaDiaryFollowUpSymptom,
  DiaryEffectLog as PrismaDiaryEffectLog,
  Prisma,
} from '@/generated/prisma/client'
import { DiaryEntry } from '@/domain/diary/enterprise/entities/diary-entry'
import { DiarySymptomLog } from '@/domain/diary/enterprise/entities/diary-symptom-log'
import { DiaryFollowUp } from '@/domain/diary/enterprise/entities/diary-follow-up'
import { DiaryFollowUpSymptom } from '@/domain/diary/enterprise/entities/diary-follow-up-symptom'
import { DiaryEffectLog } from '@/domain/diary/enterprise/entities/diary-effect-log'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaFollowUpWithRelations = PrismaDiaryFollowUp & {
  SymptomAssessments?: PrismaDiaryFollowUpSymptom[]
  Effects?: PrismaDiaryEffectLog[]
}

export type PrismaDiaryEntryWithRelations = PrismaDiaryEntry & {
  Symptoms?: PrismaDiarySymptomLog[]
  FollowUps?: PrismaFollowUpWithRelations[]
}

export class PrismaDiaryEntryMapper {
  static toDomain(raw: PrismaDiaryEntryWithRelations): DiaryEntry {
    const entryId = new UniqueEntityID(raw.id)

    const symptoms = (raw.Symptoms ?? []).map((s) =>
      DiarySymptomLog.create(
        {
          diaryEntryId: entryId,
          symptomKey: s.symptomKey,
          customSymptomName: s.customSymptomName ?? undefined,
          severityBefore: s.severityBefore,
        },
        new UniqueEntityID(s.id),
      ),
    )

    const followUps = (raw.FollowUps ?? []).map((f) => {
      const followUpId = new UniqueEntityID(f.id)
      const assessments = (f.SymptomAssessments ?? []).map((a) =>
        DiaryFollowUpSymptom.create(
          {
            followUpId,
            symptomLogId: new UniqueEntityID(a.symptomLogId),
            severityAfter: a.severityAfter,
          },
          new UniqueEntityID(a.id),
        ),
      )
      const effects = (f.Effects ?? []).map((e) =>
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
          diaryEntryId: entryId,
          evaluatedAt: f.evaluatedAt,
          notes: f.notes ?? undefined,
          tags: f.tags,
          symptomAssessments: assessments,
          effects,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt,
        },
        followUpId,
      )
    })

    return DiaryEntry.create(
      {
        userId: new UniqueEntityID(raw.userId),
        date: raw.date,
        time: raw.time,
        productId: raw.productId
          ? new UniqueEntityID(raw.productId)
          : undefined,
        customProductName: raw.customProductName ?? undefined,
        administrationMethod: raw.administrationMethod,
        doseAmount: Number(raw.doseAmount),
        doseUnit: raw.doseUnit,
        notes: raw.notes ?? undefined,
        targetCondition: raw.targetCondition ?? undefined,
        isFavorite: raw.isFavorite,
        symptoms,
        followUps,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      entryId,
    )
  }

  static toPrismaCreate(
    entry: DiaryEntry,
  ): Prisma.DiaryEntryUncheckedCreateInput {
    return {
      id: entry.id.toString(),
      userId: entry.userId.toString(),
      date: entry.date,
      time: entry.time,
      productId: entry.productId?.toString() ?? null,
      customProductName: entry.customProductName ?? null,
      administrationMethod: entry.administrationMethod,
      doseAmount: entry.doseAmount,
      doseUnit: entry.doseUnit,
      notes: entry.notes ?? null,
      targetCondition: entry.targetCondition ?? null,
      isFavorite: entry.isFavorite,
      createdAt: entry.createdAt,
      Symptoms: {
        create: entry.symptoms.map((s) => ({
          id: s.id.toString(),
          symptomKey: s.symptomKey,
          customSymptomName: s.customSymptomName ?? null,
          severityBefore: s.severityBefore,
        })),
      },
    }
  }
}
