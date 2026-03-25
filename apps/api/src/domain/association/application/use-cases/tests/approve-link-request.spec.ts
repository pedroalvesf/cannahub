import { ApproveLinkRequestUseCase } from '../approve-link-request';
import { InMemoryPatientAssociationLinksRepository } from '@/test/repositories/in-memory-patient-association-links-repository';
import { makePatientAssociationLink } from '@/test/factories/make-patient-association-link';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { LinkNotFoundError } from '../errors/link-not-found-error';
import { NotAuthorizedForAssociationError } from '../errors/not-authorized-for-association-error';

let linksRepository: InMemoryPatientAssociationLinksRepository;
let sut: ApproveLinkRequestUseCase;

describe('ApproveLinkRequestUseCase', () => {
  beforeEach(() => {
    linksRepository = new InMemoryPatientAssociationLinksRepository();
    sut = new ApproveLinkRequestUseCase(linksRepository);
  });

  it('should approve a link request', async () => {
    const associationId = new UniqueEntityID();
    const link = makePatientAssociationLink({ associationId, status: 'requested' });
    linksRepository.items.push(link);

    const result = await sut.execute({
      linkId: link.id.toString(),
      associationId: associationId.toString(),
      approvedByUserId: 'approver-id',
    });

    expect(result.isRight()).toBe(true);
    expect(linksRepository.items[0]?.status).toBe('active');
  });

  it('should fail if link not found', async () => {
    const result = await sut.execute({
      linkId: 'non-existent',
      associationId: 'any',
      approvedByUserId: 'any',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(LinkNotFoundError);
  });

  it('should fail if link belongs to another association', async () => {
    const link = makePatientAssociationLink({ associationId: new UniqueEntityID() });
    linksRepository.items.push(link);

    const result = await sut.execute({
      linkId: link.id.toString(),
      associationId: 'different',
      approvedByUserId: 'any',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAuthorizedForAssociationError);
  });
});
