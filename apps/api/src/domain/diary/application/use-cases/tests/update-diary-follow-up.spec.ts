import { UpdateDiaryFollowUpUseCase } from '../update-diary-follow-up'
import { InMemoryDiaryEntriesRepository } from '@/test/repositories/in-memory-diary-entries-repository'
import { InMemoryDiaryFollowUpsRepository } from '@/test/repositories/in-memory-diary-follow-ups-repository'
import { makeDiaryEntry } from '@/test/factories/make-diary-entry'
import { DiaryFollowUp } from '../../../enterprise/entities/diary-follow-up'
import { DiaryFollowUpSymptom } from '../../../enterprise/entities/diary-follow-up-symptom'
import { DiaryEffectLog } from '../../../enterprise/entities/diary-effect-log'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiaryEntryNotFoundError } from '../errors/diary-entry-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'

let entriesRepository: InMemoryDiaryEntriesRepository
let followUpsRepository: InMemoryDiaryFollowUpsRepository
let sut: UpdateDiaryFollowUpUseCase

async function seedFollowUp(userId = 'user-1') {
  const entry = makeDiaryEntry({
    userId: new UniqueEntityID(userId),
    date: new Date('2026-04-06T08:00:00Z'),
  })
  await entriesRepository.create(entry)

  const followUp = DiaryFollowUp.create({
    diaryEntryId: entry.id,
    evaluatedAt: new Date('2026-04-06T10:00:00Z'),
    notes: 'Original',
    tags: ['as_expected'],
    symptomAssessments: [
      DiaryFollowUpSymptom.create({
        followUpId: new UniqueEntityID(),
        symptomLogId: new UniqueEntityID('symptom-1'),
        severityAfter: 5,
      }),
    ],
    effects: [
      DiaryEffectLog.create({
        followUpId: new UniqueEntityID(),
        effectKey: 'relaxed',
        isPositive: true,
      }),
    ],
  })
  await followUpsRepository.create(followUp)

  return { entry, followUp }
}

describe('UpdateDiaryFollowUpUseCase', () => {
  beforeEach(() => {
    entriesRepository = new InMemoryDiaryEntriesRepository()
    followUpsRepository = new InMemoryDiaryFollowUpsRepository()
    sut = new UpdateDiaryFollowUpUseCase(entriesRepository, followUpsRepository)
  })

  it('should update notes, tags and evaluatedAt', async () => {
    const { followUp } = await seedFollowUp()

    const result = await sut.execute({
      followUpId: followUp.id.toString(),
      userId: 'user-1',
      notes: 'Atualizado',
      tags: ['better_than_expected'],
      evaluatedAt: new Date('2026-04-06T12:00:00Z'),
    })

    expect(result.isRight()).toBe(true)
    const updated = await followUpsRepository.findById(followUp.id.toString())
    expect(updated?.notes).toBe('Atualizado')
    expect(updated?.tags).toEqual(['better_than_expected'])
    expect(updated?.evaluatedAt).toEqual(new Date('2026-04-06T12:00:00Z'))
  })

  it('should fully replace symptom assessments and effects', async () => {
    const { followUp } = await seedFollowUp()

    const result = await sut.execute({
      followUpId: followUp.id.toString(),
      userId: 'user-1',
      symptomAssessments: [
        { symptomLogId: 'symptom-2', severityAfter: 1 },
        { symptomLogId: 'symptom-3', severityAfter: 2 },
      ],
      effects: [{ effectKey: 'sleepy', isPositive: true }],
    })

    expect(result.isRight()).toBe(true)
    const updated = await followUpsRepository.findById(followUp.id.toString())
    expect(updated?.symptomAssessments).toHaveLength(2)
    expect(updated?.symptomAssessments[0]?.severityAfter).toBe(1)
    expect(updated?.effects).toHaveLength(1)
    expect(updated?.effects[0]?.effectKey).toBe('sleepy')
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
      notes: 'hack',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
