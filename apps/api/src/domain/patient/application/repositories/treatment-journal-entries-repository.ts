import { TreatmentJournalEntry } from '../../enterprise/entities/treatment-journal-entry';

export abstract class TreatmentJournalEntriesRepository {
  abstract findById(id: string): Promise<TreatmentJournalEntry | null>;
  abstract findByUserId(userId: string): Promise<TreatmentJournalEntry[]>;
  abstract create(entry: TreatmentJournalEntry): Promise<void>;
  abstract save(entry: TreatmentJournalEntry): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
