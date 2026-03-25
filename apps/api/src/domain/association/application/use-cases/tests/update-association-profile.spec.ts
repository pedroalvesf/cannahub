import { UpdateAssociationProfileUseCase } from '../update-association-profile';
import { InMemoryAssociationsRepository } from '@/test/repositories/in-memory-associations-repository';
import { makeAssociation } from '@/test/factories/make-association';
import { AssociationNotFoundError } from '../errors/association-not-found-error';

let associationsRepository: InMemoryAssociationsRepository;
let sut: UpdateAssociationProfileUseCase;

describe('UpdateAssociationProfileUseCase', () => {
  beforeEach(() => {
    associationsRepository = new InMemoryAssociationsRepository();
    sut = new UpdateAssociationProfileUseCase(associationsRepository);
  });

  it('should update association profile fields', async () => {
    const association = makeAssociation();
    associationsRepository.items.push(association);

    const result = await sut.execute({
      associationId: association.id.toString(),
      description: 'Updated description',
      membershipFee: 500,
      membershipPeriod: 'annual',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.association.description).toBe('Updated description');
      expect(result.value.association.membershipFee).toBe(500);
      expect(result.value.association.membershipPeriod).toBe('annual');
    }
  });

  it('should fail if association not found', async () => {
    const result = await sut.execute({
      associationId: 'non-existent',
      description: 'test',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AssociationNotFoundError);
  });
});
