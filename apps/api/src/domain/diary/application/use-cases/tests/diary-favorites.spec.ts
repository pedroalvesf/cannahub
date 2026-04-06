import { CreateDiaryFavoriteUseCase } from '../create-diary-favorite'
import { ListDiaryFavoritesUseCase } from '../list-diary-favorites'
import { DeleteDiaryFavoriteUseCase } from '../delete-diary-favorite'
import { CreateEntryFromFavoriteUseCase } from '../create-entry-from-favorite'
import { InMemoryDiaryFavoritesRepository } from '@/test/repositories/in-memory-diary-favorites-repository'
import { InMemoryDiaryEntriesRepository } from '@/test/repositories/in-memory-diary-entries-repository'
import { makeDiaryFavorite } from '@/test/factories/make-diary-favorite'
import { DiaryFavoriteNotFoundError } from '../errors/diary-favorite-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let favoritesRepository: InMemoryDiaryFavoritesRepository
let entriesRepository: InMemoryDiaryEntriesRepository

describe('Diary Favorites Use Cases', () => {
  beforeEach(() => {
    favoritesRepository = new InMemoryDiaryFavoritesRepository()
    entriesRepository = new InMemoryDiaryEntriesRepository()
  })

  describe('CreateDiaryFavoriteUseCase', () => {
    it('should create a favorite', async () => {
      const sut = new CreateDiaryFavoriteUseCase(favoritesRepository)

      const result = await sut.execute({
        userId: 'user-1',
        name: 'Meu oleo da manha',
        customProductName: 'Oleo CBD',
        administrationMethod: 'oil',
        doseAmount: 5,
        doseUnit: 'drops',
        symptomKeys: ['pain', 'anxiety'],
      })

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.favorite.name).toBe('Meu oleo da manha')
        expect(result.value.favorite.symptomKeys).toEqual(['pain', 'anxiety'])
      }
      expect(favoritesRepository.items).toHaveLength(1)
    })
  })

  describe('ListDiaryFavoritesUseCase', () => {
    it('should list favorites for a user', async () => {
      const sut = new ListDiaryFavoritesUseCase(favoritesRepository)
      const userId = new UniqueEntityID('user-1')

      favoritesRepository.items.push(
        makeDiaryFavorite({ userId }),
        makeDiaryFavorite({ userId }),
        makeDiaryFavorite({ userId: new UniqueEntityID('user-2') }),
      )

      const result = await sut.execute({ userId: 'user-1' })

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.favorites).toHaveLength(2)
      }
    })
  })

  describe('DeleteDiaryFavoriteUseCase', () => {
    it('should delete a favorite', async () => {
      const sut = new DeleteDiaryFavoriteUseCase(favoritesRepository)
      const favorite = makeDiaryFavorite({
        userId: new UniqueEntityID('user-1'),
      })
      favoritesRepository.items.push(favorite)

      const result = await sut.execute({
        favoriteId: favorite.id.toString(),
        userId: 'user-1',
      })

      expect(result.isRight()).toBe(true)
      expect(favoritesRepository.items).toHaveLength(0)
    })

    it('should fail if favorite not found', async () => {
      const sut = new DeleteDiaryFavoriteUseCase(favoritesRepository)

      const result = await sut.execute({
        favoriteId: 'non-existent',
        userId: 'user-1',
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(DiaryFavoriteNotFoundError)
    })

    it('should fail if user does not own the favorite', async () => {
      const sut = new DeleteDiaryFavoriteUseCase(favoritesRepository)
      const favorite = makeDiaryFavorite({
        userId: new UniqueEntityID('user-1'),
      })
      favoritesRepository.items.push(favorite)

      const result = await sut.execute({
        favoriteId: favorite.id.toString(),
        userId: 'user-2',
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(NotAllowedError)
    })
  })

  describe('CreateEntryFromFavoriteUseCase', () => {
    it('should create an entry from a favorite', async () => {
      const sut = new CreateEntryFromFavoriteUseCase(
        entriesRepository,
        favoritesRepository,
      )
      const favorite = makeDiaryFavorite({
        userId: new UniqueEntityID('user-1'),
        symptomKeys: ['pain', 'anxiety'],
        administrationMethod: 'oil',
        doseAmount: 5,
        doseUnit: 'drops',
      })
      favoritesRepository.items.push(favorite)

      const result = await sut.execute({
        favoriteId: favorite.id.toString(),
        userId: 'user-1',
        date: new Date('2026-04-06'),
        time: '08:00',
      })

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.entry.administrationMethod).toBe('oil')
        expect(result.value.entry.doseAmount).toBe(5)
        expect(result.value.entry.symptoms).toHaveLength(2)
        expect(result.value.entry.symptoms[0]?.severityBefore).toBe('none')
      }
      expect(entriesRepository.items).toHaveLength(1)
    })

    it('should fail if favorite not found', async () => {
      const sut = new CreateEntryFromFavoriteUseCase(
        entriesRepository,
        favoritesRepository,
      )

      const result = await sut.execute({
        favoriteId: 'non-existent',
        userId: 'user-1',
        date: new Date(),
        time: '08:00',
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(DiaryFavoriteNotFoundError)
    })
  })
})
