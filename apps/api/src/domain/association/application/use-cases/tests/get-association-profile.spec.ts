import { GetAssociationProfileUseCase } from '../get-association-profile';
import { InMemoryAssociationsRepository } from '@/test/repositories/in-memory-associations-repository';
import { makeAssociation } from '@/test/factories/make-association';
import { AssociationNotFoundError } from '../errors/association-not-found-error';

let associationsRepository: InMemoryAssociationsRepository;
let sut: GetAssociationProfileUseCase;

describe('GetAssociationProfileUseCase', () => {
  beforeEach(() => {
    associationsRepository = new InMemoryAssociationsRepository();
    sut = new GetAssociationProfileUseCase(associationsRepository);
  });

  it('should return association profile', async () => {
    const association = makeAssociation({ name: 'Test Association' });
    associationsRepository.items.push(association);

    const result = await sut.execute({ associationId: association.id.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.association.name).toBe('Test Association');
    }
  });

  it('should fail if association not found', async () => {
    const result = await sut.execute({ associationId: 'non-existent' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AssociationNotFoundError);
  });
});
