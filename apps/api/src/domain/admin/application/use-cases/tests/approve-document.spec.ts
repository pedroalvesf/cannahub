import { InMemoryDocumentsRepository } from '@/test/repositories/in-memory-documents-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { ApproveDocumentUseCase } from '../approve-document';
import { makeDocument } from '@/test/factories/make-document';
import { makeUser } from '@/test/factories/make-user';
import { DocumentNotFoundError } from '../errors/document-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let documentsRepository: InMemoryDocumentsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: ApproveDocumentUseCase;

describe('Approve Document', () => {
  beforeEach(() => {
    documentsRepository = new InMemoryDocumentsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new ApproveDocumentUseCase(documentsRepository, usersRepository);
  });

  it('should approve a document', async () => {
    const doc = makeDocument();
    await documentsRepository.create(doc);

    const result = await sut.execute({
      documentId: doc.id.toString(),
      reviewerId: 'admin-id',
    });

    expect(result.isRight()).toBe(true);
    expect(documentsRepository.items[0].status).toBe('approved');
    expect(documentsRepository.items[0].reviewedBy?.toString()).toBe('admin-id');
  });

  it('should update user documentsStatus to approved when all docs are approved', async () => {
    const userId = new UniqueEntityID();
    const user = makeUser({ documentsStatus: 'pending_review' }, userId);
    await usersRepository.create(user);

    const doc1 = makeDocument({ userId, status: 'approved' });
    const doc2 = makeDocument({ userId });
    await documentsRepository.create(doc1);
    await documentsRepository.create(doc2);

    await sut.execute({
      documentId: doc2.id.toString(),
      reviewerId: 'admin-id',
    });

    const updatedUser = await usersRepository.findById(userId.toString());
    expect(updatedUser?.documentsStatus).toBe('approved');
  });

  it('should NOT update user documentsStatus when not all docs are approved', async () => {
    const userId = new UniqueEntityID();
    const user = makeUser({ documentsStatus: 'pending_review' }, userId);
    await usersRepository.create(user);

    const doc1 = makeDocument({ userId });
    const doc2 = makeDocument({ userId });
    await documentsRepository.create(doc1);
    await documentsRepository.create(doc2);

    await sut.execute({
      documentId: doc1.id.toString(),
      reviewerId: 'admin-id',
    });

    const updatedUser = await usersRepository.findById(userId.toString());
    expect(updatedUser?.documentsStatus).toBe('pending_review');
  });

  it('should return error when document not found', async () => {
    const result = await sut.execute({
      documentId: 'non-existent',
      reviewerId: 'admin-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DocumentNotFoundError);
  });
});
