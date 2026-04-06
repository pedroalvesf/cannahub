import { GetSymptomTrendUseCase } from '../get-symptom-trend'
import { InMemoryDiaryEntriesRepository } from '@/test/repositories/in-memory-diary-entries-repository'
import { makeDiaryEntry } from '@/test/factories/make-diary-entry'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiarySymptomLog } from '@/domain/diary/enterprise/entities/diary-symptom-log'

let diaryEntriesRepository: InMemoryDiaryEntriesRepository
let sut: GetSymptomTrendUseCase

describe('GetSymptomTrendUseCase', () => {
  beforeEach(() => {
    diaryEntriesRepository = new InMemoryDiaryEntriesRepository()
    sut = new GetSymptomTrendUseCase(diaryEntriesRepository)
  })

  it('should return trend with multiple days', async () => {
    const userId = new UniqueEntityID('user-1')

    const entry1 = makeDiaryEntry({
      userId,
      date: new Date('2026-04-01'),
    })
    entry1.symptoms = [
      DiarySymptomLog.create({
        diaryEntryId: entry1.id,
        symptomKey: 'pain',
        severityBefore: 'severe',
        severityAfter: 'moderate',
      }),
    ]

    const entry2 = makeDiaryEntry({
      userId,
      date: new Date('2026-04-03'),
    })
    entry2.symptoms = [
      DiarySymptomLog.create({
        diaryEntryId: entry2.id,
        symptomKey: 'pain',
        severityBefore: 'moderate',
        severityAfter: 'mild',
      }),
    ]

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
      expect(result.value.dataPoints[0]?.avgSeverityBefore).toBe(3) // severe = 3
      expect(result.value.dataPoints[0]?.avgSeverityAfter).toBe(2) // moderate = 2
      expect(result.value.dataPoints[1]?.date).toBe('2026-04-03')
      expect(result.value.dataPoints[1]?.avgSeverityBefore).toBe(2) // moderate = 2
      expect(result.value.dataPoints[1]?.avgSeverityAfter).toBe(1) // mild = 1
    }
  })

  it('should handle gaps in dates', async () => {
    const userId = new UniqueEntityID('user-1')

    const entry = makeDiaryEntry({
      userId,
      date: new Date('2026-04-01'),
    })
    entry.symptoms = [
      DiarySymptomLog.create({
        diaryEntryId: entry.id,
        symptomKey: 'pain',
        severityBefore: 'mild',
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
      // Only 1 data point, not filling gaps
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
