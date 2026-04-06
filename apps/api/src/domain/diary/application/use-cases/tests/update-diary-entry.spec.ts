import { UpdateDiaryEntryUseCase } from '../update-diary-entry'
import { InMemoryDiaryEntriesRepository } from '@/test/repositories/in-memory-diary-entries-repository'
import { makeDiaryEntry } from '@/test/factories/make-diary-entry'
import { DiaryEntryNotFoundError } from '../errors/diary-entry-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiarySymptomLog } from '@/domain/diary/enterprise/entities/diary-symptom-log'

let diaryEntriesRepository: InMemoryDiaryEntriesRepository
let sut: UpdateDiaryEntryUseCase

describe('UpdateDiaryEntryUseCase', () => {
  beforeEach(() => {
    diaryEntriesRepository = new InMemoryDiaryEntriesRepository()
    sut = new UpdateDiaryEntryUseCase(diaryEntriesRepository)
  })

  it('should update a diary entry', async () => {
    const userId = new UniqueEntityID('user-1')
    const entry = makeDiaryEntry({ userId })
    diaryEntriesRepository.items.push(entry)

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-1',
      notes: 'Updated notes',
      doseAmount: 10,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.entry.notes).toBe('Updated notes')
      expect(result.value.entry.doseAmount).toBe(10)
    }
  })

  it('should update severityAfter on symptoms', async () => {
    const userId = new UniqueEntityID('user-1')
    const entry = makeDiaryEntry({ userId })
    const symptom = DiarySymptomLog.create({
      diaryEntryId: entry.id,
      symptomKey: 'pain',
      severityBefore: 'severe',
    })
    entry.symptoms = [symptom]
    diaryEntriesRepository.items.push(entry)

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-1',
      severityAfterUpdates: [
        { symptomLogId: symptom.id.toString(), severityAfter: 'mild' },
      ],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.entry.symptoms[0]?.severityAfter).toBe('mild')
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
