import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiaryEntriesRepository } from '../repositories/diary-entries-repository'
import { DiaryEntry } from '../../enterprise/entities/diary-entry'
import { DiarySymptomLog } from '../../enterprise/entities/diary-symptom-log'
import { DiaryEffectLog } from '../../enterprise/entities/diary-effect-log'
import { InvalidDiaryEntryError } from './errors/invalid-diary-entry-error'

interface SymptomInput {
  symptomKey: string
  customSymptomName?: string
  severityBefore: string
}

interface EffectInput {
  effectKey: string
  isPositive: boolean
  customEffectName?: string
}

interface CreateDiaryEntryRequest {
  userId: string
  date: Date
  time: string
  productId?: string
  customProductName?: string
  administrationMethod: string
  doseAmount: number
  doseUnit: string
  notes?: string
  symptoms?: SymptomInput[]
  effects?: EffectInput[]
}

type CreateDiaryEntryResponse = Either<
  InvalidDiaryEntryError,
  { entry: DiaryEntry }
>

@Injectable()
export class CreateDiaryEntryUseCase {
  constructor(private diaryEntriesRepository: DiaryEntriesRepository) {}

  async execute(
    request: CreateDiaryEntryRequest,
  ): Promise<CreateDiaryEntryResponse> {
    if (!request.productId && !request.customProductName) {
      return left(
        new InvalidDiaryEntryError(
          'Informe um produto ou nome personalizado.',
        ),
      )
    }

    const entry = DiaryEntry.create({
      userId: new UniqueEntityID(request.userId),
      date: request.date,
      time: request.time,
      productId: request.productId
        ? new UniqueEntityID(request.productId)
        : undefined,
      customProductName: request.customProductName,
      administrationMethod: request.administrationMethod,
      doseAmount: request.doseAmount,
      doseUnit: request.doseUnit,
      notes: request.notes,
    })

    const symptoms = (request.symptoms ?? []).map((s) =>
      DiarySymptomLog.create({
        diaryEntryId: entry.id,
        symptomKey: s.symptomKey,
        customSymptomName: s.customSymptomName,
        severityBefore: s.severityBefore,
      }),
    )

    const effects = (request.effects ?? []).map((e) =>
      DiaryEffectLog.create({
        diaryEntryId: entry.id,
        effectKey: e.effectKey,
        isPositive: e.isPositive,
        customEffectName: e.customEffectName,
      }),
    )

    entry.symptoms = symptoms
    entry.effects = effects

    await this.diaryEntriesRepository.create(entry)

    return right({ entry })
  }
}
