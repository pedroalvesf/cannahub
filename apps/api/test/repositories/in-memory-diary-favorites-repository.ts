import { DiaryFavoritesRepository } from '@/domain/diary/application/repositories/diary-favorites-repository'
import { DiaryFavorite } from '@/domain/diary/enterprise/entities/diary-favorite'

export class InMemoryDiaryFavoritesRepository
  implements DiaryFavoritesRepository
{
  public items: DiaryFavorite[] = []

  async create(favorite: DiaryFavorite): Promise<void> {
    this.items.push(favorite)
  }

  async findById(id: string): Promise<DiaryFavorite | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findManyByUserId(userId: string): Promise<DiaryFavorite[]> {
    return this.items.filter((item) => item.userId.toString() === userId)
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toString() !== id)
  }
}
