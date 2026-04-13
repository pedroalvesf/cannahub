import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { TreatmentJournalEntriesRepository } from '../repositories/treatment-journal-entries-repository';
import { TreatmentJournalEntry } from '../../enterprise/entities/treatment-journal-entry';

type ListJournalEntriesResponse = Either<
  never,
  { entries: TreatmentJournalEntry[] }
>;

@Injectable()
export class ListJournalEntriesUseCase {
  constructor(
    private entriesRepository: TreatmentJournalEntriesRepository,
  ) {}

  async execute(userId: string): Promise<ListJournalEntriesResponse> {
    const entries = await this.entriesRepository.findByUserId(userId);
    return right({ entries });
  }
}
