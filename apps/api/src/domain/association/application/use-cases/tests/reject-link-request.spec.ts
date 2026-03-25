import { RejectLinkRequestUseCase } from '../reject-link-request';
import { InMemoryPatientAssociationLinksRepository } from '@/test/repositories/in-memory-patient-association-links-repository';
import { makePatientAssociationLink } from '@/test/factories/make-patient-association-link';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { LinkNotFoundError } from '../errors/link-not-found-error';

let linksRepository: InMemoryPatientAssociationLinksRepository;
let sut: RejectLinkRequestUseCase;

describe('RejectLinkRequestUseCase', () => {
  beforeEach(() => {
    linksRepository = new InMemoryPatientAssociationLinksRepository();
    sut = new RejectLinkRequestUseCase(linksRepository);
  });

  it('should reject a link request', async () => {
    const associationId = new UniqueEntityID();
    const link = makePatientAssociationLink({ associationId, status: 'requested' });
    linksRepository.items.push(link);

    const result = await sut.execute({
      linkId: link.id.toString(),
      associationId: associationId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(linksRepository.items[0]?.status).toBe('rejected');
  });

  it('should fail if link not found', async () => {
    const result = await sut.execute({
      linkId: 'non-existent',
      associationId: 'any',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(LinkNotFoundError);
  });
});
