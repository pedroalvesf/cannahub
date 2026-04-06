import { CreateDiaryEntryUseCase } from '../create-diary-entry'
import { InMemoryDiaryEntriesRepository } from '@/test/repositories/in-memory-diary-entries-repository'
import { InvalidDiaryEntryError } from '../errors/invalid-diary-entry-error'

let diaryEntriesRepository: InMemoryDiaryEntriesRepository
let sut: CreateDiaryEntryUseCase

describe('CreateDiaryEntryUseCase', () => {
  beforeEach(() => {
    diaryEntriesRepository = new InMemoryDiaryEntriesRepository()
    sut = new CreateDiaryEntryUseCase(diaryEntriesRepository)
  })

  it('should create a diary entry with symptoms and effects', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      date: new Date('2026-04-06'),
      time: '08:00',
      customProductName: 'Oleo CBD 15mg/ml',
      administrationMethod: 'oil',
      doseAmount: 5,
      doseUnit: 'drops',
      notes: 'Tomei pela manha',
      symptoms: [
        { symptomKey: 'pain', severityBefore: 'moderate' },
        { symptomKey: 'anxiety', severityBefore: 'mild' },
      ],
      effects: [
        { effectKey: 'relaxed', isPositive: true },
        { effectKey: 'dry_mouth', isPositive: false },
      ],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.entry.customProductName).toBe('Oleo CBD 15mg/ml')
      expect(result.value.entry.symptoms).toHaveLength(2)
      expect(result.value.entry.effects).toHaveLength(2)
    }
    expect(diaryEntriesRepository.items).toHaveLength(1)
  })

  it('should create a diary entry with a product ID', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      date: new Date('2026-04-06'),
      time: '10:00',
      productId: 'product-1',
      administrationMethod: 'capsule',
      doseAmount: 1,
      doseUnit: 'units',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.entry.productId?.toString()).toBe('product-1')
    }
  })

  it('should create a diary entry without symptoms', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      date: new Date('2026-04-06'),
      time: '14:00',
      customProductName: 'Flor Indica',
      administrationMethod: 'flower',
      doseAmount: 0.5,
      doseUnit: 'g',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.entry.symptoms).toHaveLength(0)
      expect(result.value.entry.effects).toHaveLength(0)
    }
  })

  it('should fail if no product or custom product name is provided', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      date: new Date('2026-04-06'),
      time: '08:00',
      administrationMethod: 'oil',
      doseAmount: 5,
      doseUnit: 'drops',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDiaryEntryError)
  })
})
