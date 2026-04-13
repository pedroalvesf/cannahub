import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateJournalEntryUseCase } from '../update-journal-entry';
import { JournalEntryNotFoundError } from '../errors/journal-entry-not-found-error';
import { NotEntryOwnerError } from '../errors/not-entry-owner-error';
import { InMemoryTreatmentJournalEntriesRepository } from '@/test/repositories/in-memory-treatment-journal-entries-repository';
import { makeJournalEntry } from '@/test/factories/make-journal-entry';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let repo: InMemoryTreatmentJournalEntriesRepository;
let sut: UpdateJournalEntryUseCase;

describe('UpdateJournalEntryUseCase', () => {
  beforeEach(() => {
    repo = new InMemoryTreatmentJournalEntriesRepository();
    sut = new UpdateJournalEntryUseCase(repo);
  });

  it('updates fields when the user owns the entry', async () => {
    const entry = makeJournalEntry({
      userId: new UniqueEntityID('user-1'),
      notes: 'Original',
      mood: 3,
    });
    await repo.create(entry);

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-1',
      notes: 'Updated',
      mood: 5,
      visibility: 'shareable',
    });

    expect(result.isRight()).toBe(true);
    const stored = repo.items[0]!;
    expect(stored.notes).toBe('Updated');
    expect(stored.mood).toBe(5);
    expect(stored.visibility).toBe('shareable');
  });

  it('returns JournalEntryNotFoundError when entry does not exist', async () => {
    const result = await sut.execute({
      entryId: 'ghost',
      userId: 'user-1',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(JournalEntryNotFoundError);
  });

  it('returns NotEntryOwnerError when another user tries to update', async () => {
    const entry = makeJournalEntry({
      userId: new UniqueEntityID('user-1'),
    });
    await repo.create(entry);

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-2',
      notes: 'Hacked',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotEntryOwnerError);
  });
});
