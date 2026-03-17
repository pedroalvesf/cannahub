import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { DocumentsRepository } from '../repositories/documents-repository';
import { Document } from '../../enterprise/entities/document';

interface ListUserDocumentsRequest {
  userId: string;
}

type ListUserDocumentsResponse = Either<never, { documents: Document[] }>;

@Injectable()
export class ListUserDocumentsUseCase {
  constructor(private documentsRepository: DocumentsRepository) {}

  async execute(
    request: ListUserDocumentsRequest,
  ): Promise<ListUserDocumentsResponse> {
    const documents = await this.documentsRepository.findByUserId(
      request.userId,
    );

    return right({ documents });
  }
}
