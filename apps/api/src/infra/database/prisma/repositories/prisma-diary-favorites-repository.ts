import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DiaryFavoritesRepository } from '@/domain/diary/application/repositories/diary-favorites-repository'
import { DiaryFavorite } from '@/domain/diary/enterprise/entities/diary-favorite'
import { PrismaDiaryFavoriteMapper } from '../mappers/prisma-diary-favorite-mapper'

@Injectable()
export class PrismaDiaryFavoritesRepository
  implements DiaryFavoritesRepository
{
  constructor(private prisma: PrismaService) {}

  async create(favorite: DiaryFavorite): Promise<void> {
    const data = PrismaDiaryFavoriteMapper.toPrismaCreate(favorite)
    await this.prisma.diaryFavorite.create({ data })
  }

  async findById(id: string): Promise<DiaryFavorite | null> {
    const raw = await this.prisma.diaryFavorite.findUnique({
      where: { id },
    })

    return raw ? PrismaDiaryFavoriteMapper.toDomain(raw) : null
  }

  async findManyByUserId(userId: string): Promise<DiaryFavorite[]> {
    const items = await this.prisma.diaryFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return items.map(PrismaDiaryFavoriteMapper.toDomain)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.diaryFavorite.delete({ where: { id } })
  }
}
