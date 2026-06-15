import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiaryFavoritesRepository } from '../repositories/diary-favorites-repository'
import { DiaryFavorite } from '../../enterprise/entities/diary-favorite'

interface CreateDiaryFavoriteRequest {
  userId: string
  name: string
  productId?: string
  customProductName?: string
  administrationMethod: string
  doseAmount: number
  doseUnit: string
  symptomKeys: string[]
}

type CreateDiaryFavoriteResponse = Either<never, { favorite: DiaryFavorite }>

@Injectable()
export class CreateDiaryFavoriteUseCase {
  constructor(private diaryFavoritesRepository: DiaryFavoritesRepository) {}

  async execute(
    request: CreateDiaryFavoriteRequest,
  ): Promise<CreateDiaryFavoriteResponse> {
    const favorite = DiaryFavorite.create({
      userId: new UniqueEntityID(request.userId),
      name: request.name,
      productId: request.productId
        ? new UniqueEntityID(request.productId)
        : undefined,
      customProductName: request.customProductName,
      administrationMethod: request.administrationMethod,
      doseAmount: request.doseAmount,
      doseUnit: request.doseUnit,
      symptomKeys: request.symptomKeys,
    })

    await this.diaryFavoritesRepository.create(favorite)

    return right({ favorite })
  }
}
