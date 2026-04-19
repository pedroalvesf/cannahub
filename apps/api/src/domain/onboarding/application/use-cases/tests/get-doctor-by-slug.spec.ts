import { describe, it, expect, beforeEach } from 'vitest';
import { GetDoctorBySlugUseCase } from '../get-doctor-by-slug';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InMemoryDoctorsRepository } from '@/test/repositories/in-memory-doctors-repository';
import { makeDoctor } from '@/test/factories/make-doctor';

let repo: InMemoryDoctorsRepository;
let sut: GetDoctorBySlugUseCase;

describe('GetDoctorBySlugUseCase', () => {
  beforeEach(() => {
    repo = new InMemoryDoctorsRepository();
    sut = new GetDoctorBySlugUseCase(repo);
  });

  it('returns the doctor when slug matches and directory listed', async () => {
    await repo.create(
      makeDoctor({ slug: 'dra-camila', directoryListed: true }),
    );
    const result = await sut.execute('dra-camila');
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.doctor.slug).toBe('dra-camila');
    }
  });

  it('returns ResourceNotFoundError when slug is unknown', async () => {
    const result = await sut.execute('ghost');
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('returns not found when doctor exists but is not directory listed', async () => {
    await repo.create(makeDoctor({ slug: 'private', directoryListed: false }));
    const result = await sut.execute('private');
    expect(result.isLeft()).toBe(true);
  });

  it('returns not found when doctor is inactive', async () => {
    await repo.create(
      makeDoctor({ slug: 'retired', directoryListed: true, active: false }),
    );
    const result = await sut.execute('retired');
    expect(result.isLeft()).toBe(true);
  });
});
