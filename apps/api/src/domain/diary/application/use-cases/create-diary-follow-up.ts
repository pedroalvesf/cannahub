import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiaryEntriesRepository } from '../repositories/diary-entries-repository'
import { DiaryFollowUpsRepository } from '../repositories/diary-follow-ups-repository'
import { DiaryFollowUp } from '../../enterprise/entities/diary-follow-up'
import { DiaryFollowUpSymptom } from '../../enterprise/entities/diary-follow-up-symptom'
import { DiaryEffectLog } from '../../enterprise/entities/diary-effect-log'
import { DiaryEntryNotFoundError } from './errors/diary-entry-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { InvalidDiaryEntryError } from './errors/invalid-diary-entry-error'

interface SymptomAssessmentInput {
  symptomLogId: string
  severityAfter: number
}

interface EffectInput {
  effectKey: string
  isPositive: boolean
  customEffectName?: string
}

interface CreateDiaryFollowUpRequest {
  entryId: string
  userId: string
  evaluatedAt: Date
  notes?: string
  tags?: string[]
  symptomAssessments?: SymptomAssessmentInput[]
  effects?: EffectInput[]
}

type CreateDiaryFollowUpResponse = Either<
  DiaryEntryNotFoundError | NotAllowedError | InvalidDiaryEntryError,
  { followUp: DiaryFollowUp }
>

@Injectable()
export class CreateDiaryFollowUpUseCase {
  constructor(
    private diaryEntriesRepository: DiaryEntriesRepository,
    private diaryFollowUpsRepository: DiaryFollowUpsRepository,
  ) {}

  async execute(
    request: CreateDiaryFollowUpRequest,
  ): Promise<CreateDiaryFollowUpResponse> {
    const entry = await this.diaryEntriesRepository.findById(request.entryId)

    if (!entry) {
      return left(new DiaryEntryNotFoundError(request.entryId))
    }

    if (entry.userId.toString() !== request.userId) {
      return left(new NotAllowedError())
    }

    const entryAt = new Date(entry.date)
    if (request.evaluatedAt < entryAt) {
      return left(
        new InvalidDiaryEntryError(
          'A avaliação não pode ser anterior ao registro do consumo.',
        ),
      )
    }

    // Garante que os symptomLogIds referenciados existem na entry
    const validSymptomIds = new Set(entry.symptoms.map((s) => s.id.toString()))
    for (const a of request.symptomAssessments ?? []) {
      if (!validSymptomIds.has(a.symptomLogId)) {
        return left(
          new InvalidDiaryEntryError(
            `Sintoma ${a.symptomLogId} não pertence a esta entry.`,
          ),
        )
      }
    }

    const followUp = DiaryFollowUp.create({
      diaryEntryId: entry.id,
      evaluatedAt: request.evaluatedAt,
      notes: request.notes,
      tags: request.tags ?? [],
    })

    followUp.symptomAssessments = (request.symptomAssessments ?? []).map((a) =>
      DiaryFollowUpSymptom.create({
        followUpId: followUp.id,
        symptomLogId: new UniqueEntityID(a.symptomLogId),
        severityAfter: a.severityAfter,
      }),
    )

    followUp.effects = (request.effects ?? []).map((e) =>
      DiaryEffectLog.create({
        followUpId: followUp.id,
        effectKey: e.effectKey,
        isPositive: e.isPositive,
        customEffectName: e.customEffectName,
      }),
    )

    await this.diaryFollowUpsRepository.create(followUp)

    return right({ followUp })
  }
}
