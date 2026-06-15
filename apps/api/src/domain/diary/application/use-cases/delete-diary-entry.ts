import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { DiaryEntriesRepository } from '../repositories/diary-entries-repository'
import { DiaryEntryNotFoundError } from './errors/diary-entry-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteDiaryEntryRequest {
  entryId: string
  userId: string
}

type DeleteDiaryEntryResponse = Either<
  DiaryEntryNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteDiaryEntryUseCase {
  constructor(private diaryEntriesRepository: DiaryEntriesRepository) {}

  async execute(
    request: DeleteDiaryEntryRequest,
  ): Promise<DeleteDiaryEntryResponse> {
    const entry = await this.diaryEntriesRepository.findById(request.entryId)

    if (!entry) {
      return left(new DiaryEntryNotFoundError(request.entryId))
    }

    if (entry.userId.toString() !== request.userId) {
      return left(new NotAllowedError())
    }

    await this.diaryEntriesRepository.delete(request.entryId)

    return right(null)
  }
}
