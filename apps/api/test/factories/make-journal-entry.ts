import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  TreatmentJournalEntry,
  TreatmentJournalEntryProps,
} from '@/domain/patient/enterprise/entities/treatment-journal-entry';

let entryCounter = 0;

export function makeJournalEntry(
  override: Partial<TreatmentJournalEntryProps> = {},
  id?: UniqueEntityID,
) {
  entryCounter++;
  return TreatmentJournalEntry.create(
    {
      userId: new UniqueEntityID(),
      entryDate: new Date('2026-04-01'),
      notes: `Entry ${entryCounter}`,
      ...override,
    },
    id,
  );
}
