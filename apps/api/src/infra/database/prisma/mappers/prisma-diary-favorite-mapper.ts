import {
  DiaryFavorite as PrismaDiaryFavorite,
  Prisma,
} from '@/generated/prisma/client'
import { DiaryFavorite } from '@/domain/diary/enterprise/entities/diary-favorite'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaDiaryFavoriteMapper {
  static toDomain(raw: PrismaDiaryFavorite): DiaryFavorite {
    return DiaryFavorite.create(
      {
        userId: new UniqueEntityID(raw.userId),
        name: raw.name,
        productId: raw.productId
          ? new UniqueEntityID(raw.productId)
          : undefined,
        customProductName: raw.customProductName ?? undefined,
        administrationMethod: raw.administrationMethod,
        doseAmount: Number(raw.doseAmount),
        doseUnit: raw.doseUnit,
        symptomKeys: raw.symptomKeys,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(
    favorite: DiaryFavorite,
  ): Prisma.DiaryFavoriteUncheckedCreateInput {
    return {
      id: favorite.id.toString(),
      userId: favorite.userId.toString(),
      name: favorite.name,
      productId: favorite.productId?.toString() ?? null,
      customProductName: favorite.customProductName ?? null,
      administrationMethod: favorite.administrationMethod,
      doseAmount: favorite.doseAmount,
      doseUnit: favorite.doseUnit,
      symptomKeys: favorite.symptomKeys,
      createdAt: favorite.createdAt,
    }
  }
}
