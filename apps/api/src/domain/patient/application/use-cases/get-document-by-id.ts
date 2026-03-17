import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DocumentsRepository } from '../repositories/documents-repository';
import { Document } from '../../enterprise/entities/document';

export class DocumentNotFoundError extends Error {
  constructor(id: string) {
    super(`Document "${id}" not found.`);
  }
}

interface GetDocumentByIdRequest {
  documentId: string;
}

type GetDocumentByIdResponse = Either<
  DocumentNotFoundError,
  { document: Document }
>;

@Injectable()
export class GetDocumentByIdUseCase {
  constructor(private documentsRepository: DocumentsRepository) {}

  async execute(
    request: GetDocumentByIdRequest,
  ): Promise<GetDocumentByIdResponse> {
    const document = await this.documentsRepository.findById(
      request.documentId,
    );

    if (!document) {
      return left(new DocumentNotFoundError(request.documentId));
    }

    return right({ document });
  }
}
