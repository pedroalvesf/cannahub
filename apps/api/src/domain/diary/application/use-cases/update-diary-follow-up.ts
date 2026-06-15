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

interface UpdateDiaryFollowUpRequest {
  followUpId: string
  userId: string
  evaluatedAt?: Date
  notes?: string | null
  tags?: string[]
  symptomAssessments?: { symptomLogId: string; severityAfter: number }[]
  effects?: { effectKey: string; isPositive: boolean; customEffectName?: string }[]
}

type UpdateDiaryFollowUpResponse = Either<
  DiaryEntryNotFoundError | NotAllowedError,
  { followUp: DiaryFollowUp }
>

@Injectable()
export class UpdateDiaryFollowUpUseCase {
  constructor(
    private diaryEntriesRepository: DiaryEntriesRepository,
    private diaryFollowUpsRepository: DiaryFollowUpsRepository,
  ) {}

  async execute(
    request: UpdateDiaryFollowUpRequest,
  ): Promise<UpdateDiaryFollowUpResponse> {
    const followUp = await this.diaryFollowUpsRepository.findById(request.followUpId)
    if (!followUp) {
      return left(new DiaryEntryNotFoundError(request.followUpId))
    }

    const entry = await this.diaryEntriesRepository.findById(
      followUp.diaryEntryId.toString(),
    )
    if (!entry || entry.userId.toString() !== request.userId) {
      return left(new NotAllowedError())
    }

    if (request.evaluatedAt !== undefined) followUp.evaluatedAt = request.evaluatedAt
    if (request.notes !== undefined) followUp.notes = request.notes ?? undefined
    if (request.tags !== undefined) followUp.tags = request.tags

    if (request.symptomAssessments !== undefined) {
      followUp.symptomAssessments = request.symptomAssessments.map((a) =>
        DiaryFollowUpSymptom.create({
          followUpId: followUp.id,
          symptomLogId: new UniqueEntityID(a.symptomLogId),
          severityAfter: a.severityAfter,
        }),
      )
    }

    if (request.effects !== undefined) {
      followUp.effects = request.effects.map((e) =>
        DiaryEffectLog.create({
          followUpId: followUp.id,
          effectKey: e.effectKey,
          isPositive: e.isPositive,
          customEffectName: e.customEffectName,
        }),
      )
    }

    await this.diaryFollowUpsRepository.update(followUp)

    return right({ followUp })
  }
}
