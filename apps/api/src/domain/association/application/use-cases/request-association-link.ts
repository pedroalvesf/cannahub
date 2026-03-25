import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AssociationsRepository } from '../repositories/associations-repository';
import { PatientAssociationLinksRepository } from '../repositories/patient-association-links-repository';
import { PatientsRepository } from '@/domain/patient/application/repositories/patients-repository';
import { PatientAssociationLink } from '../../enterprise/entities/patient-association-link';
import { Patient } from '@/domain/patient/enterprise/entities/patient';
import { AssociationNotFoundError } from './errors/association-not-found-error';
import { DuplicateLinkError } from './errors/duplicate-link-error';

interface RequestAssociationLinkRequest {
  associationId: string;
  userId: string;
}

type RequestAssociationLinkResponse = Either<
  AssociationNotFoundError | DuplicateLinkError,
  { link: PatientAssociationLink }
>;

@Injectable()
export class RequestAssociationLinkUseCase {
  constructor(
    private associationsRepository: AssociationsRepository,
    private linksRepository: PatientAssociationLinksRepository,
    private patientsRepository: PatientsRepository,
  ) {}

  async execute(
    request: RequestAssociationLinkRequest,
  ): Promise<RequestAssociationLinkResponse> {
    const association = await this.associationsRepository.findById(
      request.associationId,
    );

    if (!association) {
      return left(new AssociationNotFoundError(request.associationId));
    }

    // Find or create patient record for user
    let patient = await this.patientsRepository.findByUserId(
      request.userId,
    );

    if (!patient) {
      patient = Patient.create({
        userId: new UniqueEntityID(request.userId),
        type: 'self',
      });
      await this.patientsRepository.create(patient);
    }

    const patientId = patient.id.toString();

    // Check for existing active or requested link
    const existingLink =
      await this.linksRepository.findByAssociationAndPatient(
        request.associationId,
        patientId,
      );

    if (
      existingLink &&
      (existingLink.status === 'requested' || existingLink.status === 'active')
    ) {
      return left(new DuplicateLinkError());
    }

    const link = PatientAssociationLink.create({
      associationId: new UniqueEntityID(request.associationId),
      patientId: new UniqueEntityID(patientId),
      requestedByUserId: new UniqueEntityID(request.userId),
    });

    await this.linksRepository.create(link);

    return right({ link });
  }
}
