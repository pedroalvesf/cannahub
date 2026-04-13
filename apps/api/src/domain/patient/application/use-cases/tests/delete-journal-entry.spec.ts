import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteJournalEntryUseCase } from '../delete-journal-entry';
import { JournalEntryNotFoundError } from '../errors/journal-entry-not-found-error';
import { NotEntryOwnerError } from '../errors/not-entry-owner-error';
import { InMemoryTreatmentJournalEntriesRepository } from '@/test/repositories/in-memory-treatment-journal-entries-repository';
import { makeJournalEntry } from '@/test/factories/make-journal-entry';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let repo: InMemoryTreatmentJournalEntriesRepository;
let sut: DeleteJournalEntryUseCase;

describe('DeleteJournalEntryUseCase', () => {
  beforeEach(() => {
    repo = new InMemoryTreatmentJournalEntriesRepository();
    sut = new DeleteJournalEntryUseCase(repo);
  });

  it('deletes the entry when user owns it', async () => {
    const entry = makeJournalEntry({
      userId: new UniqueEntityID('user-1'),
    });
    await repo.create(entry);

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(repo.items).toHaveLength(0);
  });

  it('returns JournalEntryNotFoundError when entry does not exist', async () => {
    const result = await sut.execute({
      entryId: 'ghost',
      userId: 'user-1',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(JournalEntryNotFoundError);
  });

  it('returns NotEntryOwnerError when another user tries to delete', async () => {
    const entry = makeJournalEntry({
      userId: new UniqueEntityID('user-1'),
    });
    await repo.create(entry);

    const result = await sut.execute({
      entryId: entry.id.toString(),
      userId: 'user-2',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotEntryOwnerError);
    expect(repo.items).toHaveLength(1);
  });
});
