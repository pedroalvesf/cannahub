import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { TreatmentJournalEntriesRepository } from '../repositories/treatment-journal-entries-repository';
import { JournalEntryNotFoundError } from './errors/journal-entry-not-found-error';
import { NotEntryOwnerError } from './errors/not-entry-owner-error';

interface DeleteJournalEntryRequest {
  entryId: string;
  userId: string;
}

type DeleteJournalEntryResponse = Either<
  JournalEntryNotFoundError | NotEntryOwnerError,
  null
>;

@Injectable()
export class DeleteJournalEntryUseCase {
  constructor(
    private entriesRepository: TreatmentJournalEntriesRepository,
  ) {}

  async execute(
    request: DeleteJournalEntryRequest,
  ): Promise<DeleteJournalEntryResponse> {
    const entry = await this.entriesRepository.findById(request.entryId);
    if (!entry) return left(new JournalEntryNotFoundError());
    if (entry.userId.toString() !== request.userId) {
      return left(new NotEntryOwnerError());
    }

    await this.entriesRepository.delete(request.entryId);
    return right(null);
  }
}
