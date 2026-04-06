import { ListDiaryEntriesUseCase } from '../list-diary-entries'
import { InMemoryDiaryEntriesRepository } from '@/test/repositories/in-memory-diary-entries-repository'
import { makeDiaryEntry } from '@/test/factories/make-diary-entry'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiarySymptomLog } from '@/domain/diary/enterprise/entities/diary-symptom-log'

let diaryEntriesRepository: InMemoryDiaryEntriesRepository
let sut: ListDiaryEntriesUseCase

describe('ListDiaryEntriesUseCase', () => {
  beforeEach(() => {
    diaryEntriesRepository = new InMemoryDiaryEntriesRepository()
    sut = new ListDiaryEntriesUseCase(diaryEntriesRepository)
  })

  it('should list entries with no filters', async () => {
    const userId = new UniqueEntityID('user-1')
    diaryEntriesRepository.items.push(
      makeDiaryEntry({ userId }),
      makeDiaryEntry({ userId }),
      makeDiaryEntry({ userId: new UniqueEntityID('user-2') }),
    )

    const result = await sut.execute({ userId: 'user-1' })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.entries).toHaveLength(2)
      expect(result.value.total).toBe(2)
    }
  })

  it('should list entries with date range filter', async () => {
    const userId = new UniqueEntityID('user-1')
    diaryEntriesRepository.items.push(
      makeDiaryEntry({ userId, date: new Date('2026-04-01') }),
      makeDiaryEntry({ userId, date: new Date('2026-04-05') }),
      makeDiaryEntry({ userId, date: new Date('2026-03-15') }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      dateFrom: new Date('2026-04-01'),
      dateTo: new Date('2026-04-06'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.entries).toHaveLength(2)
    }
  })

  it('should list entries with symptom filter', async () => {
    const userId = new UniqueEntityID('user-1')
    const entryWithPain = makeDiaryEntry({ userId })
    const symptom = DiarySymptomLog.create({
      diaryEntryId: entryWithPain.id,
      symptomKey: 'pain',
      severityBefore: 'moderate',
    })
    entryWithPain.symptoms = [symptom]

    diaryEntriesRepository.items.push(
      entryWithPain,
      makeDiaryEntry({ userId }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      symptomKey: 'pain',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.entries).toHaveLength(1)
    }
  })

  it('should paginate results', async () => {
    const userId = new UniqueEntityID('user-1')
    for (let i = 0; i < 5; i++) {
      diaryEntriesRepository.items.push(makeDiaryEntry({ userId }))
    }

    const result = await sut.execute({
      userId: 'user-1',
      page: 2,
      perPage: 2,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.entries).toHaveLength(2)
      expect(result.value.total).toBe(5)
    }
  })

  it('should return empty results', async () => {
    const result = await sut.execute({ userId: 'user-1' })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.entries).toHaveLength(0)
      expect(result.value.total).toBe(0)
    }
  })
})
