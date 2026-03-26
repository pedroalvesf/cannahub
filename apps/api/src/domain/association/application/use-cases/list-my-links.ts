import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { PatientAssociationLinksRepository } from '../repositories/patient-association-links-repository';
import { AssociationsRepository } from '../repositories/associations-repository';
import { PatientsRepository } from '@/domain/patient/application/repositories/patients-repository';

interface MyLink {
  id: string;
  associationId: string;
  associationName: string;
  status: string;
  feeStatus?: string;
  feeExpiresAt?: Date;
  startDate?: Date;
  createdAt: Date;
}

interface ListMyLinksRequest {
  userId: string;
}

type ListMyLinksResponse = Either<never, { links: MyLink[] }>;

@Injectable()
export class ListMyLinksUseCase {
  constructor(
    private linksRepository: PatientAssociationLinksRepository,
    private associationsRepository: AssociationsRepository,
    private patientsRepository: PatientsRepository,
  ) {}

  async execute(
    request: ListMyLinksRequest,
  ): Promise<ListMyLinksResponse> {
    // Find patient record for user
    const patient = await this.patientsRepository.findByUserId(
      request.userId,
    );

    if (!patient) {
      return right({ links: [] });
    }

    const links = await this.linksRepository.findByPatientId(
      patient.id.toString(),
    );

    // Enrich with association names
    const enrichedLinks: MyLink[] = await Promise.all(
      links.map(async (link) => {
        const association = await this.associationsRepository.findById(
          link.associationId.toString(),
        );

        return {
          id: link.id.toString(),
          associationId: link.associationId.toString(),
          associationName: association?.name ?? 'Associação desconhecida',
          status: link.status,
          feeStatus: link.feeStatus,
          feeExpiresAt: link.feeExpiresAt,
          startDate: link.startDate,
          createdAt: link.createdAt,
        };
      }),
    );

    return right({ links: enrichedLinks });
  }
}
