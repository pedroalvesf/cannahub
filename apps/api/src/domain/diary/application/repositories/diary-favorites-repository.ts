import { DiaryFavorite } from '../../enterprise/entities/diary-favorite'

export abstract class DiaryFavoritesRepository {
  abstract create(favorite: DiaryFavorite): Promise<void>
  abstract findById(id: string): Promise<DiaryFavorite | null>
  abstract findManyByUserId(userId: string): Promise<DiaryFavorite[]>
  abstract delete(id: string): Promise<void>
}
