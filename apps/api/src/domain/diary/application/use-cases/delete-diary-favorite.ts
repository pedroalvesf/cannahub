import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { DiaryFavoritesRepository } from '../repositories/diary-favorites-repository'
import { DiaryFavoriteNotFoundError } from './errors/diary-favorite-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteDiaryFavoriteRequest {
  favoriteId: string
  userId: string
}

type DeleteDiaryFavoriteResponse = Either<
  DiaryFavoriteNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteDiaryFavoriteUseCase {
  constructor(private diaryFavoritesRepository: DiaryFavoritesRepository) {}

  async execute(
    request: DeleteDiaryFavoriteRequest,
  ): Promise<DeleteDiaryFavoriteResponse> {
    const favorite = await this.diaryFavoritesRepository.findById(
      request.favoriteId,
    )

    if (!favorite) {
      return left(new DiaryFavoriteNotFoundError(request.favoriteId))
    }

    if (favorite.userId.toString() !== request.userId) {
      return left(new NotAllowedError())
    }

    await this.diaryFavoritesRepository.delete(request.favoriteId)

    return right(null)
  }
}
