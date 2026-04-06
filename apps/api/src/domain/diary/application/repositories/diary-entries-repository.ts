import { DiaryEntry } from '../../enterprise/entities/diary-entry'

export interface FindManyDiaryEntriesParams {
  userId: string
  page: number
  perPage: number
  dateFrom?: Date
  dateTo?: Date
  productId?: string
  administrationMethod?: string
  symptomKey?: string
}

export abstract class DiaryEntriesRepository {
  abstract create(entry: DiaryEntry): Promise<void>
  abstract findById(id: string): Promise<DiaryEntry | null>
  abstract findManyByUserId(
    params: FindManyDiaryEntriesParams,
  ): Promise<{ entries: DiaryEntry[]; total: number }>
  abstract update(entry: DiaryEntry): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract countByUserId(userId: string): Promise<number>
}
