import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { DiaryFavoritesRepository } from '../repositories/diary-favorites-repository'
import { DiaryFavorite } from '../../enterprise/entities/diary-favorite'

interface ListDiaryFavoritesRequest {
  userId: string
}

type ListDiaryFavoritesResponse = Either<never, { favorites: DiaryFavorite[] }>

@Injectable()
export class ListDiaryFavoritesUseCase {
  constructor(private diaryFavoritesRepository: DiaryFavoritesRepository) {}

  async execute(
    request: ListDiaryFavoritesRequest,
  ): Promise<ListDiaryFavoritesResponse> {
    const favorites = await this.diaryFavoritesRepository.findManyByUserId(
      request.userId,
    )

    return right({ favorites })
  }
}
