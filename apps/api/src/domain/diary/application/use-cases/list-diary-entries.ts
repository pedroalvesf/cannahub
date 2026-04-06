import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { DiaryEntriesRepository } from '../repositories/diary-entries-repository'
import { DiaryEntry } from '../../enterprise/entities/diary-entry'

interface ListDiaryEntriesRequest {
  userId: string
  page?: number
  perPage?: number
  dateFrom?: Date
  dateTo?: Date
  productId?: string
  administrationMethod?: string
  symptomKey?: string
}

type ListDiaryEntriesResponse = Either<
  never,
  { entries: DiaryEntry[]; total: number }
>

@Injectable()
export class ListDiaryEntriesUseCase {
  constructor(private diaryEntriesRepository: DiaryEntriesRepository) {}

  async execute(
    request: ListDiaryEntriesRequest,
  ): Promise<ListDiaryEntriesResponse> {
    const { entries, total } =
      await this.diaryEntriesRepository.findManyByUserId({
        userId: request.userId,
        page: request.page ?? 1,
        perPage: request.perPage ?? 20,
        dateFrom: request.dateFrom,
        dateTo: request.dateTo,
        productId: request.productId,
        administrationMethod: request.administrationMethod,
        symptomKey: request.symptomKey,
      })

    return right({ entries, total })
  }
}
