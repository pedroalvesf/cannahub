import { ListAssociationLinksUseCase } from '../list-association-links';
import { InMemoryPatientAssociationLinksRepository } from '@/test/repositories/in-memory-patient-association-links-repository';
import { makePatientAssociationLink } from '@/test/factories/make-patient-association-link';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let linksRepository: InMemoryPatientAssociationLinksRepository;
let sut: ListAssociationLinksUseCase;

describe('ListAssociationLinksUseCase', () => {
  beforeEach(() => {
    linksRepository = new InMemoryPatientAssociationLinksRepository();
    sut = new ListAssociationLinksUseCase(linksRepository);
  });

  it('should list all links for an association', async () => {
    const associationId = new UniqueEntityID();

    linksRepository.items.push(
      makePatientAssociationLink({ associationId, status: 'requested' }),
      makePatientAssociationLink({ associationId, status: 'active' }),
    );

    const result = await sut.execute({ associationId: associationId.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.links).toHaveLength(2);
    }
  });

  it('should filter links by status', async () => {
    const associationId = new UniqueEntityID();

    linksRepository.items.push(
      makePatientAssociationLink({ associationId, status: 'requested' }),
      makePatientAssociationLink({ associationId, status: 'active' }),
    );

    const result = await sut.execute({
      associationId: associationId.toString(),
      status: 'requested',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.links).toHaveLength(1);
      expect(result.value.links[0]?.status).toBe('requested');
    }
  });
});
