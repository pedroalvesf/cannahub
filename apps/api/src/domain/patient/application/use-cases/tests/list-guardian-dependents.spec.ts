import { ListGuardianDependentsUseCase } from '../list-guardian-dependents';
import { InMemoryDependentsRepository } from '@/test/repositories/in-memory-dependents-repository';
import { makeDependent } from '@/test/factories/make-dependent';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let dependentsRepository: InMemoryDependentsRepository;
let sut: ListGuardianDependentsUseCase;

describe('ListGuardianDependentsUseCase', () => {
  beforeEach(() => {
    dependentsRepository = new InMemoryDependentsRepository();
    sut = new ListGuardianDependentsUseCase(dependentsRepository);
  });

  it('should list dependents of a guardian', async () => {
    const guardianUserId = new UniqueEntityID();
    dependentsRepository.items.push(
      makeDependent({ guardianUserId }),
      makeDependent({ guardianUserId }),
      makeDependent({ guardianUserId: new UniqueEntityID() }),
    );

    const result = await sut.execute({
      guardianUserId: guardianUserId.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.dependents).toHaveLength(2);
    }
  });

  it('should return an empty list when the guardian has no dependents', async () => {
    const result = await sut.execute({ guardianUserId: 'no-deps' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.dependents).toHaveLength(0);
    }
  });
});
