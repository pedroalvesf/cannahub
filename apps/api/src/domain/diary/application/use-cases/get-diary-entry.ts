import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { DiaryEntriesRepository } from '../repositories/diary-entries-repository'
import { DiaryEntry } from '../../enterprise/entities/diary-entry'
import { DiaryEntryNotFoundError } from './errors/diary-entry-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface GetDiaryEntryRequest {
  entryId: string
  userId: string
}

type GetDiaryEntryResponse = Either<
  DiaryEntryNotFoundError | NotAllowedError,
  { entry: DiaryEntry }
>

@Injectable()
export class GetDiaryEntryUseCase {
  constructor(private diaryEntriesRepository: DiaryEntriesRepository) {}

  async execute(
    request: GetDiaryEntryRequest,
  ): Promise<GetDiaryEntryResponse> {
    const entry = await this.diaryEntriesRepository.findById(request.entryId)

    if (!entry) {
      return left(new DiaryEntryNotFoundError(request.entryId))
    }

    if (entry.userId.toString() !== request.userId) {
      return left(new NotAllowedError())
    }

    return right({ entry })
  }
}
