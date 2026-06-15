import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { PatientAssociationLinksRepository } from '../repositories/patient-association-links-repository';
import { PatientsRepository } from '@/domain/patient/application/repositories/patients-repository';
import { DocumentsRepository } from '@/domain/patient/application/repositories/documents-repository';
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';
import { LinkNotFoundError } from './errors/link-not-found-error';
import { NotAuthorizedForAssociationError } from './errors/not-authorized-for-association-error';
import { DocumentsNotSharedError } from './errors/documents-not-shared-error';

interface SharedDocument {
  id: string;
  type: string;
  url: string;
  status: string;
  createdAt: Date;
}

interface ListMemberDocumentsRequest {
  associationId: string;
  linkId: string;
}

type ListMemberDocumentsResponse = Either<
  LinkNotFoundError | NotAuthorizedForAssociationError | DocumentsNotSharedError,
  { patientName: string | null; documents: SharedDocument[] }
>;

@Injectable()
export class ListMemberDocumentsUseCase {
  constructor(
    private linksRepository: PatientAssociationLinksRepository,
    private patientsRepository: PatientsRepository,
    private documentsRepository: DocumentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(
    request: ListMemberDocumentsRequest,
  ): Promise<ListMemberDocumentsResponse> {
    const link = await this.linksRepository.findById(request.linkId);

    if (!link) {
      return left(new LinkNotFoundError(request.linkId));
    }

    // The association can only read documents for its own links.
    if (link.associationId.toString() !== request.associationId) {
      return left(new NotAuthorizedForAssociationError());
    }

    // Access is gated by the patient's explicit consent on an active link.
    if (link.status !== 'active' || !link.documentsShared) {
      return left(new DocumentsNotSharedError());
    }

    // Documents are keyed by userId, but the link stores patientId — resolve it.
    const patient = await this.patientsRepository.findById(
      link.patientId.toString(),
    );
    const userId = patient?.userId?.toString();

    if (!userId) {
      return right({ patientName: null, documents: [] });
    }

    const [documents, user] = await Promise.all([
      this.documentsRepository.findByUserId(userId),
      this.usersRepository.findById(userId),
    ]);

    return right({
      patientName: user?.name ?? null,
      documents: documents.map((doc) => ({
        id: doc.id.toString(),
        type: doc.type,
        url: doc.url,
        status: doc.status,
        createdAt: doc.createdAt,
      })),
    });
  }
}
