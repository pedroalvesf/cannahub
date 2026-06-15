import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DiaryFavorite,
  DiaryFavoriteProps,
} from '@/domain/diary/enterprise/entities/diary-favorite'

let diaryFavoriteCounter = 0

export function makeDiaryFavorite(
  override: Partial<DiaryFavoriteProps> = {},
  id?: UniqueEntityID,
) {
  diaryFavoriteCounter++

  return DiaryFavorite.create(
    {
      userId: new UniqueEntityID(),
      name: `Favorite ${diaryFavoriteCounter}`,
      administrationMethod: 'oil',
      doseAmount: 5,
      doseUnit: 'drops',
      symptomKeys: ['pain'],
      customProductName: `Product ${diaryFavoriteCounter}`,
      ...override,
    },
    id,
  )
}
