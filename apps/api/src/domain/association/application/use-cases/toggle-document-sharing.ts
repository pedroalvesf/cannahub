import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { PatientAssociationLinksRepository } from '../repositories/patient-association-links-repository';
import { PatientsRepository } from '@/domain/patient/application/repositories/patients-repository';
import { LinkNotFoundError } from './errors/link-not-found-error';
import { NotAuthorizedForAssociationError } from './errors/not-authorized-for-association-error';
import { LinkNotActiveError } from './errors/link-not-active-error';

interface ToggleDocumentSharingRequest {
  userId: string;
  linkId: string;
  share: boolean;
}

type ToggleDocumentSharingResponse = Either<
  LinkNotFoundError | NotAuthorizedForAssociationError | LinkNotActiveError,
  { documentsShared: boolean }
>;

@Injectable()
export class ToggleDocumentSharingUseCase {
  constructor(
    private linksRepository: PatientAssociationLinksRepository,
    private patientsRepository: PatientsRepository,
  ) {}

  async execute(
    request: ToggleDocumentSharingRequest,
  ): Promise<ToggleDocumentSharingResponse> {
    const link = await this.linksRepository.findById(request.linkId);

    if (!link) {
      return left(new LinkNotFoundError(request.linkId));
    }

    // Patient can only toggle sharing on their own link.
    const patient = await this.patientsRepository.findByUserId(request.userId);

    if (!patient || link.patientId.toString() !== patient.id.toString()) {
      return left(new NotAuthorizedForAssociationError());
    }

    if (link.status !== 'active') {
      return left(new LinkNotActiveError());
    }

    if (request.share) {
      link.shareDocuments();
    } else {
      link.unshareDocuments();
    }

    await this.linksRepository.save(link);

    return right({ documentsShared: link.documentsShared });
  }
}
