import { CreateDiaryFollowUpUseCase } from '../create-diary-follow-up'
import { InMemoryDiaryEntriesRepository } from '@/test/repositories/in-memory-diary-entries-repository'
import { InMemoryDiaryFollowUpsRepository } from '@/test/repositories/in-memory-diary-follow-ups-repository'
import { makeDiaryEntry } from '@/test/factories/make-diary-entry'
import { DiarySymptomLog } from '../../../enterprise/entities/diary-symptom-log'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiaryEntryNotFoundError } from '../errors/diary-entry-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { InvalidDiaryEntryError } from '../errors/invalid-diary-entry-error'

let entriesRepository: InMemoryDiaryEntriesRepository
let followUpsRepository: InMemoryDiaryFollowUpsRepository
let sut: CreateDiaryFollowUpUseCase

function makeEntryWithSymptom(userId = 'user-1') {
  const entry = makeDiaryEntry({
    userId: new UniqueEntityID(userId),
    date: new Date('2026-04-06T08:00:00Z'),
  })
  const symptom = DiarySymptomLog.create({
    diaryEntryId: entry.id,
    symptomKey: 'pain',
    severityBefore: 7,
  })
  entry.symptoms = [symptom]
  return { entry, symptom }
}

describe('CreateDiaryFollowUpUseCase', () => {
  beforeEach(() => {
    entriesRepository = new InMemoryDiaryEntriesRepository()
    followUpsRepository = new InMemoryDiaryFollowUpsRepository()
    sut = new CreateDiaryFollowUpUseCase(entriesRepository, followUpsRepository)
  })

  it('should create a follow-up with symptom assessments and effects', async () => {
    const { entry, symptom } = makeEntryWithSymptom()
    await entriesRepository.create(entry)

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-1',
      evaluatedAt: new Date('2026-04-06T10:00:00Z'),
      notes: 'Me sinto melhor',
      tags: ['as_expected'],
      symptomAssessments: [
        { symptomLogId: symptom.id.toString(), severityAfter: 3 },
      ],
      effects: [{ effectKey: 'relaxed', isPositive: true }],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      const { followUp } = result.value
      expect(followUp.symptomAssessments).toHaveLength(1)
      expect(followUp.symptomAssessments[0]?.severityAfter).toBe(3)
      expect(followUp.effects).toHaveLength(1)
      expect(followUp.tags).toEqual(['as_expected'])
    }
    expect(followUpsRepository.items).toHaveLength(1)
  })

  it('should create a follow-up with defaults when only evaluatedAt is given', async () => {
    const { entry } = makeEntryWithSymptom()
    await entriesRepository.create(entry)

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-1',
      evaluatedAt: new Date('2026-04-06T09:00:00Z'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.followUp.symptomAssessments).toHaveLength(0)
      expect(result.value.followUp.effects).toHaveLength(0)
      expect(result.value.followUp.tags).toEqual([])
    }
  })

  it('should fail if the entry does not exist', async () => {
    const result = await sut.execute({
      entryId: 'nonexistent',
      userId: 'user-1',
      evaluatedAt: new Date('2026-04-06T10:00:00Z'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DiaryEntryNotFoundError)
  })

  it('should fail if the entry belongs to another user', async () => {
    const { entry } = makeEntryWithSymptom('owner')
    await entriesRepository.create(entry)

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'intruder',
      evaluatedAt: new Date('2026-04-06T10:00:00Z'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should fail if evaluatedAt is before the entry date', async () => {
    const { entry } = makeEntryWithSymptom()
    await entriesRepository.create(entry)

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-1',
      evaluatedAt: new Date('2026-04-05T23:00:00Z'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDiaryEntryError)
  })

  it('should fail if a symptomLogId does not belong to the entry', async () => {
    const { entry } = makeEntryWithSymptom()
    await entriesRepository.create(entry)

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-1',
      evaluatedAt: new Date('2026-04-06T10:00:00Z'),
      symptomAssessments: [{ symptomLogId: 'foreign-symptom', severityAfter: 2 }],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDiaryEntryError)
    expect(followUpsRepository.items).toHaveLength(0)
  })
})
