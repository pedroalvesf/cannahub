import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DocumentsRepository } from '@/domain/patient/application/repositories/documents-repository';
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';
import { DocumentNotFoundError } from './errors/document-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface RejectDocumentRequest {
  documentId: string;
  reviewerId: string;
  reason: string;
}

type RejectDocumentResponse = Either<DocumentNotFoundError, null>;

@Injectable()
export class RejectDocumentUseCase {
  constructor(
    private documentsRepository: DocumentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    documentId,
    reviewerId,
    reason,
  }: RejectDocumentRequest): Promise<RejectDocumentResponse> {
    const document = await this.documentsRepository.findById(documentId);

    if (!document) {
      return left(new DocumentNotFoundError());
    }

    document.reject(new UniqueEntityID(reviewerId), reason);
    await this.documentsRepository.save(document);

    // Update user's documentsStatus to rejected
    const user = await this.usersRepository.findById(
      document.userId.toString(),
    );
    if (user) {
      user.documentsStatus = 'rejected';
      await this.usersRepository.save(user);
    }

    return right(null);
  }
}
