import { GetDiaryEntryUseCase } from '../get-diary-entry'
import { InMemoryDiaryEntriesRepository } from '@/test/repositories/in-memory-diary-entries-repository'
import { makeDiaryEntry } from '@/test/factories/make-diary-entry'
import { DiaryEntryNotFoundError } from '../errors/diary-entry-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiarySymptomLog } from '@/domain/diary/enterprise/entities/diary-symptom-log'
import { DiaryEffectLog } from '@/domain/diary/enterprise/entities/diary-effect-log'

let diaryEntriesRepository: InMemoryDiaryEntriesRepository
let sut: GetDiaryEntryUseCase

describe('GetDiaryEntryUseCase', () => {
  beforeEach(() => {
    diaryEntriesRepository = new InMemoryDiaryEntriesRepository()
    sut = new GetDiaryEntryUseCase(diaryEntriesRepository)
  })

  it('should return a diary entry with symptoms and effects', async () => {
    const entry = makeDiaryEntry({ userId: new UniqueEntityID('user-1') })
    const symptom = DiarySymptomLog.create({
      diaryEntryId: entry.id,
      symptomKey: 'pain',
      severityBefore: 'moderate',
    })
    const effect = DiaryEffectLog.create({
      diaryEntryId: entry.id,
      effectKey: 'relaxed',
      isPositive: true,
    })
    entry.symptoms = [symptom]
    entry.effects = [effect]
    diaryEntriesRepository.items.push(entry)

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.entry.symptoms).toHaveLength(1)
      expect(result.value.entry.effects).toHaveLength(1)
    }
  })

  it('should fail if entry is not found', async () => {
    const result = await sut.execute({
      entryId: 'non-existent',
      userId: 'user-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DiaryEntryNotFoundError)
  })

  it('should fail if user does not own the entry', async () => {
    const entry = makeDiaryEntry({ userId: new UniqueEntityID('user-1') })
    diaryEntriesRepository.items.push(entry)

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
