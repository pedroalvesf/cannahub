import {
  DiaryEntry as PrismaDiaryEntry,
  DiarySymptomLog as PrismaDiarySymptomLog,
  DiaryEffectLog as PrismaDiaryEffectLog,
  Prisma,
} from '@/generated/prisma/client'
import { DiaryEntry } from '@/domain/diary/enterprise/entities/diary-entry'
import { DiarySymptomLog } from '@/domain/diary/enterprise/entities/diary-symptom-log'
import { DiaryEffectLog } from '@/domain/diary/enterprise/entities/diary-effect-log'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export type PrismaDiaryEntryWithRelations = PrismaDiaryEntry & {
  Symptoms?: PrismaDiarySymptomLog[]
  Effects?: PrismaDiaryEffectLog[]
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
          severityAfter: s.severityAfter ?? undefined,
        },
        new UniqueEntityID(s.id),
      ),
    )

    const effects = (raw.Effects ?? []).map((e) =>
      DiaryEffectLog.create(
        {
          diaryEntryId: entryId,
          effectKey: e.effectKey,
          isPositive: e.isPositive,
          customEffectName: e.customEffectName ?? undefined,
        },
        new UniqueEntityID(e.id),
      ),
    )

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
        isFavorite: raw.isFavorite,
        symptoms,
        effects,
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
      isFavorite: entry.isFavorite,
      createdAt: entry.createdAt,
      Symptoms: {
        create: entry.symptoms.map((s) => ({
          id: s.id.toString(),
          symptomKey: s.symptomKey,
          customSymptomName: s.customSymptomName ?? null,
          severityBefore: s.severityBefore,
          severityAfter: s.severityAfter ?? null,
        })),
      },
      Effects: {
        create: entry.effects.map((e) => ({
          id: e.id.toString(),
          effectKey: e.effectKey,
          isPositive: e.isPositive,
          customEffectName: e.customEffectName ?? null,
        })),
      },
    }
  }
}
