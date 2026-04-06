import { GetDiarySummaryUseCase } from '../get-diary-summary'
import { InMemoryDiaryEntriesRepository } from '@/test/repositories/in-memory-diary-entries-repository'
import { makeDiaryEntry } from '@/test/factories/make-diary-entry'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiarySymptomLog } from '@/domain/diary/enterprise/entities/diary-symptom-log'

let diaryEntriesRepository: InMemoryDiaryEntriesRepository
let sut: GetDiarySummaryUseCase

describe('GetDiarySummaryUseCase', () => {
  beforeEach(() => {
    diaryEntriesRepository = new InMemoryDiaryEntriesRepository()
    sut = new GetDiarySummaryUseCase(diaryEntriesRepository)
  })

  it('should return summary with data', async () => {
    const userId = new UniqueEntityID('user-1')
    const entry1 = makeDiaryEntry({
      userId,
      date: new Date(),
      administrationMethod: 'oil',
      customProductName: 'Oleo CBD',
    })
    const symptom1 = DiarySymptomLog.create({
      diaryEntryId: entry1.id,
      symptomKey: 'pain',
      severityBefore: 'severe',
      severityAfter: 'mild',
    })
    entry1.symptoms = [symptom1]

    const entry2 = makeDiaryEntry({
      userId,
      date: new Date(),
      administrationMethod: 'oil',
      customProductName: 'Oleo CBD',
    })
    const symptom2 = DiarySymptomLog.create({
      diaryEntryId: entry2.id,
      symptomKey: 'pain',
      severityBefore: 'moderate',
      severityAfter: 'none',
    })
    entry2.symptoms = [symptom2]

    diaryEntriesRepository.items.push(entry1, entry2)

    const result = await sut.execute({ userId: 'user-1' })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.totalEntries).toBe(2)
      expect(result.value.mostFrequentSymptoms).toHaveLength(1)
      expect(result.value.mostFrequentSymptoms[0]?.symptomKey).toBe('pain')
      expect(result.value.mostFrequentSymptoms[0]?.count).toBe(2)
      expect(result.value.mostUsedProduct?.name).toBe('Oleo CBD')
      expect(result.value.mostUsedProduct?.count).toBe(2)
      expect(result.value.methodDistribution['oil']).toBe(2)
      // pain: avg before = (3+2)/2 = 2.5, avg after = (1+0)/2 = 0.5
      const painDelta = result.value.symptomDeltas.find(
        (d) => d.symptomKey === 'pain',
      )
      expect(painDelta?.avgSeverityBefore).toBe(2.5)
      expect(painDelta?.avgSeverityAfter).toBe(0.5)
    }
  })

  it('should return empty summary when no entries', async () => {
    const result = await sut.execute({ userId: 'user-1' })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.totalEntries).toBe(0)
      expect(result.value.mostFrequentSymptoms).toHaveLength(0)
      expect(result.value.mostUsedProduct).toBeNull()
      expect(result.value.symptomDeltas).toHaveLength(0)
      expect(result.value.methodDistribution).toEqual({})
    }
  })

  it('should filter by date range', async () => {
    const userId = new UniqueEntityID('user-1')
    diaryEntriesRepository.items.push(
      makeDiaryEntry({ userId, date: new Date('2026-04-01') }),
      makeDiaryEntry({ userId, date: new Date('2026-03-01') }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      dateFrom: new Date('2026-03-15'),
      dateTo: new Date('2026-04-06'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.totalEntries).toBe(1)
    }
  })
})
