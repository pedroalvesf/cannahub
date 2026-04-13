import { describe, it, expect, beforeEach } from 'vitest';
import { ListDirectoryDoctorsUseCase } from '../list-directory-doctors';
import { InMemoryDoctorsRepository } from '@/test/repositories/in-memory-doctors-repository';
import { makeDoctor } from '@/test/factories/make-doctor';

let repo: InMemoryDoctorsRepository;
let sut: ListDirectoryDoctorsUseCase;

describe('ListDirectoryDoctorsUseCase', () => {
  beforeEach(() => {
    repo = new InMemoryDoctorsRepository();
    sut = new ListDirectoryDoctorsUseCase(repo);
  });

  it('returns only active doctors flagged as directoryListed', async () => {
    await repo.create(makeDoctor({ slug: 'a', directoryListed: true }));
    await repo.create(makeDoctor({ slug: 'b', directoryListed: false }));
    await repo.create(
      makeDoctor({ slug: 'c', directoryListed: true, active: false }),
    );

    const result = await sut.execute({});
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.doctors).toHaveLength(1);
      expect(result.value.doctors[0]?.slug).toBe('a');
    }
  });

  it('filters by state, specialty, and telemedicine modality', async () => {
    await repo.create(
      makeDoctor({
        slug: 'sp-neuro-tm',
        state: 'SP',
        specialties: ['Neurologia'],
        telemedicine: true,
        directoryListed: true,
      }),
    );
    await repo.create(
      makeDoctor({
        slug: 'sp-dor-presencial',
        state: 'SP',
        specialties: ['Dor crônica'],
        inPerson: true,
        directoryListed: true,
      }),
    );
    await repo.create(
      makeDoctor({
        slug: 'rj-neuro-tm',
        state: 'RJ',
        specialties: ['Neurologia'],
        telemedicine: true,
        directoryListed: true,
      }),
    );

    const byState = await sut.execute({ state: 'SP' });
    expect(byState.isRight() && byState.value.doctors).toHaveLength(2);

    const bySpecialty = await sut.execute({ specialty: 'Neurologia' });
    expect(bySpecialty.isRight() && bySpecialty.value.doctors).toHaveLength(2);

    const byModality = await sut.execute({ modality: 'in_person' });
    expect(byModality.isRight() && byModality.value.doctors).toHaveLength(1);
    if (byModality.isRight()) {
      expect(byModality.value.doctors[0]?.slug).toBe('sp-dor-presencial');
    }
  });
});
