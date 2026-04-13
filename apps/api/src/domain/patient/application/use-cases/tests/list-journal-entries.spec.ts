import { describe, it, expect, beforeEach } from 'vitest';
import { ListJournalEntriesUseCase } from '../list-journal-entries';
import { InMemoryTreatmentJournalEntriesRepository } from '@/test/repositories/in-memory-treatment-journal-entries-repository';
import { makeJournalEntry } from '@/test/factories/make-journal-entry';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let repo: InMemoryTreatmentJournalEntriesRepository;
let sut: ListJournalEntriesUseCase;

describe('ListJournalEntriesUseCase', () => {
  beforeEach(() => {
    repo = new InMemoryTreatmentJournalEntriesRepository();
    sut = new ListJournalEntriesUseCase(repo);
  });

  it('returns entries only for the given user, sorted by date desc', async () => {
    const userA = new UniqueEntityID('user-a');
    const userB = new UniqueEntityID('user-b');

    await repo.create(
      makeJournalEntry({ userId: userA, entryDate: new Date('2026-04-01') }),
    );
    await repo.create(
      makeJournalEntry({ userId: userA, entryDate: new Date('2026-04-10') }),
    );
    await repo.create(
      makeJournalEntry({ userId: userB, entryDate: new Date('2026-04-05') }),
    );

    const result = await sut.execute('user-a');
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.entries).toHaveLength(2);
      expect(
        result.value.entries[0]!.entryDate.toISOString().slice(0, 10),
      ).toBe('2026-04-10');
      expect(
        result.value.entries[1]!.entryDate.toISOString().slice(0, 10),
      ).toBe('2026-04-01');
    }
  });

  it('returns empty array when user has no entries', async () => {
    const result = await sut.execute('user-ghost');
    expect(result.isRight()).toBe(true);
    if (result.isRight()) expect(result.value.entries).toEqual([]);
  });
});
