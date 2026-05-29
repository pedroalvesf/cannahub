import { DiaryFollowUp } from '../../enterprise/entities/diary-follow-up'

export abstract class DiaryFollowUpsRepository {
  abstract create(followUp: DiaryFollowUp): Promise<void>
  abstract findById(id: string): Promise<DiaryFollowUp | null>
  abstract findManyByEntryId(entryId: string): Promise<DiaryFollowUp[]>
  abstract update(followUp: DiaryFollowUp): Promise<void>
  abstract delete(id: string): Promise<void>
}
