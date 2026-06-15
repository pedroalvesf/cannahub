import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DiaryEntry,
  DiaryEntryProps,
} from '@/domain/diary/enterprise/entities/diary-entry'

let diaryEntryCounter = 0

export function makeDiaryEntry(
  override: Partial<DiaryEntryProps> = {},
  id?: UniqueEntityID,
) {
  diaryEntryCounter++

  return DiaryEntry.create(
    {
      userId: new UniqueEntityID(),
      date: new Date(),
      time: '08:00',
      administrationMethod: 'oil',
      doseAmount: 5,
      doseUnit: 'drops',
      customProductName: `Product ${diaryEntryCounter}`,
      ...override,
    },
    id,
  )
}
