import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DocumentsRepository } from '@/domain/patient/application/repositories/documents-repository';
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';
import { DocumentNotFoundError } from './errors/document-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface ApproveDocumentRequest {
  documentId: string;
  reviewerId: string;
}

type ApproveDocumentResponse = Either<DocumentNotFoundError, null>;

@Injectable()
export class ApproveDocumentUseCase {
  constructor(
    private documentsRepository: DocumentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    documentId,
    reviewerId,
  }: ApproveDocumentRequest): Promise<ApproveDocumentResponse> {
    const document = await this.documentsRepository.findById(documentId);

    if (!document) {
      return left(new DocumentNotFoundError());
    }

    document.approve(new UniqueEntityID(reviewerId));
    await this.documentsRepository.save(document);

    // Check if ALL user documents are now approved
    const userDocs = await this.documentsRepository.findByUserId(
      document.userId.toString(),
    );
    const allApproved = userDocs.every((doc) => doc.status === 'approved');

    if (allApproved) {
      const user = await this.usersRepository.findById(
        document.userId.toString(),
      );
      if (user) {
        user.documentsStatus = 'approved';
        await this.usersRepository.save(user);
      }
    }

    return right(null);
  }
}
