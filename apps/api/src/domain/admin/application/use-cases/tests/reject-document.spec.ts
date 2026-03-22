import { InMemoryDocumentsRepository } from '@/test/repositories/in-memory-documents-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { RejectDocumentUseCase } from '../reject-document';
import { makeDocument } from '@/test/factories/make-document';
import { makeUser } from '@/test/factories/make-user';
import { DocumentNotFoundError } from '../errors/document-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let documentsRepository: InMemoryDocumentsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: RejectDocumentUseCase;

describe('Reject Document', () => {
  beforeEach(() => {
    documentsRepository = new InMemoryDocumentsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new RejectDocumentUseCase(documentsRepository, usersRepository);
  });

  it('should reject a document with reason', async () => {
    const doc = makeDocument();
    await documentsRepository.create(doc);

    const result = await sut.execute({
      documentId: doc.id.toString(),
      reviewerId: 'admin-id',
      reason: 'Documento ilegível',
    });

    expect(result.isRight()).toBe(true);
    expect(documentsRepository.items[0].status).toBe('rejected');
    expect(documentsRepository.items[0].rejectionReason).toBe('Documento ilegível');
    expect(documentsRepository.items[0].reviewedBy?.toString()).toBe('admin-id');
  });

  it('should update user documentsStatus to rejected', async () => {
    const userId = new UniqueEntityID();
    const user = makeUser({ documentsStatus: 'pending_review' }, userId);
    await usersRepository.create(user);

    const doc = makeDocument({ userId });
    await documentsRepository.create(doc);

    await sut.execute({
      documentId: doc.id.toString(),
      reviewerId: 'admin-id',
      reason: 'Documento expirado',
    });

    const updatedUser = await usersRepository.findById(userId.toString());
    expect(updatedUser?.documentsStatus).toBe('rejected');
  });

  it('should return error when document not found', async () => {
    const result = await sut.execute({
      documentId: 'non-existent',
      reviewerId: 'admin-id',
      reason: 'test',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DocumentNotFoundError);
  });
});
