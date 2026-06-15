import { DeleteDiaryFollowUpUseCase } from '../delete-diary-follow-up'
import { InMemoryDiaryEntriesRepository } from '@/test/repositories/in-memory-diary-entries-repository'
import { InMemoryDiaryFollowUpsRepository } from '@/test/repositories/in-memory-diary-follow-ups-repository'
import { makeDiaryEntry } from '@/test/factories/make-diary-entry'
import { DiaryFollowUp } from '../../../enterprise/entities/diary-follow-up'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiaryEntryNotFoundError } from '../errors/diary-entry-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'

let entriesRepository: InMemoryDiaryEntriesRepository
let followUpsRepository: InMemoryDiaryFollowUpsRepository
let sut: DeleteDiaryFollowUpUseCase

async function seedFollowUp(userId = 'user-1') {
  const entry = makeDiaryEntry({
    userId: new UniqueEntityID(userId),
    date: new Date('2026-04-06T08:00:00Z'),
  })
  await entriesRepository.create(entry)

  const followUp = DiaryFollowUp.create({
    diaryEntryId: entry.id,
    evaluatedAt: new Date('2026-04-06T10:00:00Z'),
  })
  await followUpsRepository.create(followUp)

  return { entry, followUp }
}

describe('DeleteDiaryFollowUpUseCase', () => {
  beforeEach(() => {
    entriesRepository = new InMemoryDiaryEntriesRepository()
    followUpsRepository = new InMemoryDiaryFollowUpsRepository()
    sut = new DeleteDiaryFollowUpUseCase(entriesRepository, followUpsRepository)
  })

  it('should delete a follow-up owned by the user', async () => {
    const { followUp } = await seedFollowUp()

    const result = await sut.execute({
      followUpId: followUp.id.toString(),
      userId: 'user-1',
    })

    expect(result.isRight()).toBe(true)
    expect(followUpsRepository.items).toHaveLength(0)
  })

  it('should fail if the follow-up does not exist', async () => {
    const result = await sut.execute({
      followUpId: 'nonexistent',
      userId: 'user-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DiaryEntryNotFoundError)
  })

  it('should fail if the follow-up belongs to another user', async () => {
    const { followUp } = await seedFollowUp('owner')

    const result = await sut.execute({
      followUpId: followUp.id.toString(),
      userId: 'intruder',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(followUpsRepository.items).toHaveLength(1)
  })
})
