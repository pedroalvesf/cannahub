import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DiaryEntriesRepository } from '../repositories/diary-entries-repository'
import { DiaryEntry } from '../../enterprise/entities/diary-entry'
import { DiaryEntryNotFoundError } from './errors/diary-entry-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface SeverityAfterUpdate {
  symptomLogId: string
  severityAfter: string
}

interface UpdateDiaryEntryRequest {
  entryId: string
  userId: string
  date?: Date
  time?: string
  productId?: string | null
  customProductName?: string | null
  administrationMethod?: string
  doseAmount?: number
  doseUnit?: string
  notes?: string | null
  isFavorite?: boolean
  severityAfterUpdates?: SeverityAfterUpdate[]
}

type UpdateDiaryEntryResponse = Either<
  DiaryEntryNotFoundError | NotAllowedError,
  { entry: DiaryEntry }
>

@Injectable()
export class UpdateDiaryEntryUseCase {
  constructor(private diaryEntriesRepository: DiaryEntriesRepository) {}

  async execute(
    request: UpdateDiaryEntryRequest,
  ): Promise<UpdateDiaryEntryResponse> {
    const entry = await this.diaryEntriesRepository.findById(request.entryId)

    if (!entry) {
      return left(new DiaryEntryNotFoundError(request.entryId))
    }

    if (entry.userId.toString() !== request.userId) {
      return left(new NotAllowedError())
    }

    if (request.date !== undefined) entry.date = request.date
    if (request.time !== undefined) entry.time = request.time
    if (request.administrationMethod !== undefined)
      entry.administrationMethod = request.administrationMethod
    if (request.doseAmount !== undefined) entry.doseAmount = request.doseAmount
    if (request.doseUnit !== undefined) entry.doseUnit = request.doseUnit
    if (request.notes !== undefined)
      entry.notes = request.notes ?? undefined
    if (request.isFavorite !== undefined) entry.isFavorite = request.isFavorite
    if (request.productId !== undefined)
      entry.productId = request.productId
        ? new UniqueEntityID(request.productId)
        : undefined
    if (request.customProductName !== undefined)
      entry.customProductName = request.customProductName ?? undefined

    if (request.severityAfterUpdates) {
      for (const update of request.severityAfterUpdates) {
        const symptom = entry.symptoms.find(
          (s) => s.id.toString() === update.symptomLogId,
        )
        if (symptom) {
          symptom.severityAfter = update.severityAfter
        }
      }
    }

    await this.diaryEntriesRepository.update(entry)

    return right({ entry })
  }
}
