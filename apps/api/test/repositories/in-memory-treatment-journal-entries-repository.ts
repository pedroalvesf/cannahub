import { TreatmentJournalEntriesRepository } from '@/domain/patient/application/repositories/treatment-journal-entries-repository';
import { TreatmentJournalEntry } from '@/domain/patient/enterprise/entities/treatment-journal-entry';

export class InMemoryTreatmentJournalEntriesRepository
  implements TreatmentJournalEntriesRepository
{
  public items: TreatmentJournalEntry[] = [];

  async findById(id: string): Promise<TreatmentJournalEntry | null> {
    return this.items.find((i) => i.id.toString() === id) ?? null;
  }

  async findByUserId(userId: string): Promise<TreatmentJournalEntry[]> {
    return this.items
      .filter((i) => i.userId.toString() === userId)
      .sort((a, b) => b.entryDate.getTime() - a.entryDate.getTime());
  }

  async create(entry: TreatmentJournalEntry): Promise<void> {
    this.items.push(entry);
  }

  async save(entry: TreatmentJournalEntry): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === entry.id.toString(),
    );
    if (index >= 0) this.items[index] = entry;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((i) => i.id.toString() !== id);
  }
}
