import { CreateDependentUseCase } from '../create-dependent';
import { InMemoryDependentsRepository } from '@/test/repositories/in-memory-dependents-repository';
import { InvalidDependentError } from '../errors/invalid-dependent-error';

let dependentsRepository: InMemoryDependentsRepository;
let sut: CreateDependentUseCase;

describe('CreateDependentUseCase', () => {
  beforeEach(() => {
    dependentsRepository = new InMemoryDependentsRepository();
    sut = new CreateDependentUseCase(dependentsRepository);
  });

  it('should create a dependent', async () => {
    const result = await sut.execute({
      guardianUserId: 'guardian-1',
      name: 'João Silva',
      birthDate: '2015-04-10',
      documentNumber: '123.456.789-00',
      relationshipType: 'parent',
    });

    expect(result.isRight()).toBe(true);
    expect(dependentsRepository.items).toHaveLength(1);
    expect(dependentsRepository.items[0]?.name).toBe('João Silva');
    expect(dependentsRepository.items[0]?.guardianUserId.toString()).toBe(
      'guardian-1',
    );
    expect(dependentsRepository.items[0]?.birthDate).toBeInstanceOf(Date);
  });

  it('should reject an empty name', async () => {
    const result = await sut.execute({
      guardianUserId: 'guardian-1',
      name: '   ',
      relationshipType: 'parent',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidDependentError);
    expect(dependentsRepository.items).toHaveLength(0);
  });

  it('should reject an invalid relationship type', async () => {
    const result = await sut.execute({
      guardianUserId: 'guardian-1',
      name: 'João Silva',
      relationshipType: 'best_friend',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidDependentError);
  });

  it('should reject an invalid birth date', async () => {
    const result = await sut.execute({
      guardianUserId: 'guardian-1',
      name: 'João Silva',
      birthDate: 'not-a-date',
      relationshipType: 'parent',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidDependentError);
  });
});
