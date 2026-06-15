import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { DiaryEntriesRepository } from '../repositories/diary-entries-repository'
import { DiaryFollowUpsRepository } from '../repositories/diary-follow-ups-repository'
import { DiaryEntryNotFoundError } from './errors/diary-entry-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteDiaryFollowUpRequest {
  followUpId: string
  userId: string
}

type DeleteDiaryFollowUpResponse = Either<
  DiaryEntryNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteDiaryFollowUpUseCase {
  constructor(
    private diaryEntriesRepository: DiaryEntriesRepository,
    private diaryFollowUpsRepository: DiaryFollowUpsRepository,
  ) {}

  async execute(
    request: DeleteDiaryFollowUpRequest,
  ): Promise<DeleteDiaryFollowUpResponse> {
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

    await this.diaryFollowUpsRepository.delete(request.followUpId)
    return right(null)
  }
}
