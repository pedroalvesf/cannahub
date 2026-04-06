import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiaryEntriesRepository } from '../repositories/diary-entries-repository'
import { DiaryFavoritesRepository } from '../repositories/diary-favorites-repository'
import { DiaryEntry } from '../../enterprise/entities/diary-entry'
import { DiarySymptomLog } from '../../enterprise/entities/diary-symptom-log'
import { DiaryFavoriteNotFoundError } from './errors/diary-favorite-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface CreateEntryFromFavoriteRequest {
  favoriteId: string
  userId: string
  date: Date
  time: string
}

type CreateEntryFromFavoriteResponse = Either<
  DiaryFavoriteNotFoundError | NotAllowedError,
  { entry: DiaryEntry }
>

@Injectable()
export class CreateEntryFromFavoriteUseCase {
  constructor(
    private diaryEntriesRepository: DiaryEntriesRepository,
    private diaryFavoritesRepository: DiaryFavoritesRepository,
  ) {}

  async execute(
    request: CreateEntryFromFavoriteRequest,
  ): Promise<CreateEntryFromFavoriteResponse> {
    const favorite = await this.diaryFavoritesRepository.findById(
      request.favoriteId,
    )

    if (!favorite) {
      return left(new DiaryFavoriteNotFoundError(request.favoriteId))
    }

    if (favorite.userId.toString() !== request.userId) {
      return left(new NotAllowedError())
    }

    const entry = DiaryEntry.create({
      userId: new UniqueEntityID(request.userId),
      date: request.date,
      time: request.time,
      productId: favorite.productId,
      customProductName: favorite.customProductName,
      administrationMethod: favorite.administrationMethod,
      doseAmount: favorite.doseAmount,
      doseUnit: favorite.doseUnit,
    })

    const symptoms = favorite.symptomKeys.map((key) =>
      DiarySymptomLog.create({
        diaryEntryId: entry.id,
        symptomKey: key,
        severityBefore: 'none',
      }),
    )

    entry.symptoms = symptoms

    await this.diaryEntriesRepository.create(entry)

    return right({ entry })
  }
}
