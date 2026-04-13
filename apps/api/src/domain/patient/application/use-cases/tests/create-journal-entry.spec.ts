import { describe, it, expect, beforeEach } from 'vitest';
import { CreateJournalEntryUseCase } from '../create-journal-entry';
import { InMemoryTreatmentJournalEntriesRepository } from '@/test/repositories/in-memory-treatment-journal-entries-repository';

let repo: InMemoryTreatmentJournalEntriesRepository;
let sut: CreateJournalEntryUseCase;

describe('CreateJournalEntryUseCase', () => {
  beforeEach(() => {
    repo = new InMemoryTreatmentJournalEntriesRepository();
    sut = new CreateJournalEntryUseCase(repo);
  });

  it('creates a private entry with the provided fields and stores it', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      entryDate: new Date('2026-04-10'),
      mood: 4,
      symptoms: ['ansiedade', 'insônia'],
      symptomIntensity: 6,
      medicationTaken: true,
      dosage: '3 gotas, óleo CBD 30mg/ml',
      sideEffects: ['boca seca'],
      notes: 'Dia difícil pela manhã, melhor à noite.',
    });

    expect(result.isRight()).toBe(true);
    expect(repo.items).toHaveLength(1);
    const stored = repo.items[0]!;
    expect(stored.userId.toString()).toBe('user-1');
    expect(stored.mood).toBe(4);
    expect(stored.symptoms).toEqual(['ansiedade', 'insônia']);
    expect(stored.medicationTaken).toBe(true);
    expect(stored.visibility).toBe('private');
  });

  it('defaults arrays and visibility when fields are omitted', async () => {
    const result = await sut.execute({
      userId: 'user-2',
      entryDate: new Date('2026-04-11'),
      notes: 'Nota simples',
    });

    expect(result.isRight()).toBe(true);
    const stored = repo.items[0]!;
    expect(stored.symptoms).toEqual([]);
    expect(stored.sideEffects).toEqual([]);
    expect(stored.medicationTaken).toBe(false);
    expect(stored.visibility).toBe('private');
  });

  it('allows visibility shareable when explicitly passed', async () => {
    const result = await sut.execute({
      userId: 'user-3',
      entryDate: new Date('2026-04-12'),
      notes: 'Para o médico',
      visibility: 'shareable',
    });

    expect(result.isRight()).toBe(true);
    expect(repo.items[0]!.visibility).toBe('shareable');
  });
});
