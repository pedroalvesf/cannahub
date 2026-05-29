import { GetSymptomTrendUseCase } from '../get-symptom-trend'
import { InMemoryDiaryEntriesRepository } from '@/test/repositories/in-memory-diary-entries-repository'
import { makeDiaryEntry } from '@/test/factories/make-diary-entry'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiarySymptomLog } from '@/domain/diary/enterprise/entities/diary-symptom-log'
import { DiaryFollowUp } from '@/domain/diary/enterprise/entities/diary-follow-up'
import { DiaryFollowUpSymptom } from '@/domain/diary/enterprise/entities/diary-follow-up-symptom'

let diaryEntriesRepository: InMemoryDiaryEntriesRepository
let sut: GetSymptomTrendUseCase

function attachFollowUp(entry: ReturnType<typeof makeDiaryEntry>, symptom: DiarySymptomLog, severityAfter: number) {
  const followUp = DiaryFollowUp.create({
    diaryEntryId: entry.id,
    evaluatedAt: new Date(entry.date.getTime() + 60 * 60 * 1000),
  })
  followUp.symptomAssessments = [
    DiaryFollowUpSymptom.create({
      followUpId: followUp.id,
      symptomLogId: symptom.id,
      severityAfter,
    }),
  ]
  entry.followUps = [followUp]
}

describe('GetSymptomTrendUseCase', () => {
  beforeEach(() => {
    diaryEntriesRepository = new InMemoryDiaryEntriesRepository()
    sut = new GetSymptomTrendUseCase(diaryEntriesRepository)
  })

  it('should return trend with multiple days', async () => {
    const userId = new UniqueEntityID('user-1')

    const entry1 = makeDiaryEntry({ userId, date: new Date('2026-04-01') })
    const symptom1 = DiarySymptomLog.create({
      diaryEntryId: entry1.id,
      symptomKey: 'pain',
      severityBefore: 9,
    })
    entry1.symptoms = [symptom1]
    attachFollowUp(entry1, symptom1, 6)

    const entry2 = makeDiaryEntry({ userId, date: new Date('2026-04-03') })
    const symptom2 = DiarySymptomLog.create({
      diaryEntryId: entry2.id,
      symptomKey: 'pain',
      severityBefore: 5,
    })
    entry2.symptoms = [symptom2]
    attachFollowUp(entry2, symptom2, 2)

    diaryEntriesRepository.items.push(entry1, entry2)

    const result = await sut.execute({
      userId: 'user-1',
      symptomKey: 'pain',
      dateFrom: new Date('2026-04-01'),
      dateTo: new Date('2026-04-05'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.dataPoints).toHaveLength(2)
      expect(result.value.dataPoints[0]?.date).toBe('2026-04-01')
      expect(result.value.dataPoints[0]?.avgSeverityBefore).toBe(9)
      expect(result.value.dataPoints[0]?.avgSeverityAfter).toBe(6)
      expect(result.value.dataPoints[1]?.date).toBe('2026-04-03')
      expect(result.value.dataPoints[1]?.avgSeverityBefore).toBe(5)
      expect(result.value.dataPoints[1]?.avgSeverityAfter).toBe(2)
    }
  })

  it('should handle entries without follow-up', async () => {
    const userId = new UniqueEntityID('user-1')

    const entry = makeDiaryEntry({ userId, date: new Date('2026-04-01') })
    entry.symptoms = [
      DiarySymptomLog.create({
        diaryEntryId: entry.id,
        symptomKey: 'pain',
        severityBefore: 3,
      }),
    ]
    diaryEntriesRepository.items.push(entry)

    const result = await sut.execute({
      userId: 'user-1',
      symptomKey: 'pain',
      dateFrom: new Date('2026-04-01'),
      dateTo: new Date('2026-04-05'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.dataPoints).toHaveLength(1)
      expect(result.value.dataPoints[0]?.avgSeverityAfter).toBeNull()
    }
  })

  it('should return empty array for non-existent symptom', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      symptomKey: 'non_existent',
      dateFrom: new Date('2026-04-01'),
      dateTo: new Date('2026-04-05'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.dataPoints).toHaveLength(0)
    }
  })
})
