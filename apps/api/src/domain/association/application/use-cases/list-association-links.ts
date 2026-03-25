import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { PatientAssociationLinksRepository } from '../repositories/patient-association-links-repository';
import { PatientAssociationLink } from '../../enterprise/entities/patient-association-link';

interface ListAssociationLinksRequest {
  associationId: string;
  status?: string;
}

type ListAssociationLinksResponse = Either<
  never,
  { links: PatientAssociationLink[] }
>;

@Injectable()
export class ListAssociationLinksUseCase {
  constructor(
    private linksRepository: PatientAssociationLinksRepository,
  ) {}

  async execute(
    request: ListAssociationLinksRequest,
  ): Promise<ListAssociationLinksResponse> {
    const allLinks = await this.linksRepository.findByAssociationId(
      request.associationId,
    );

    const links = request.status
      ? allLinks.filter((l) => l.status === request.status)
      : allLinks;

    return right({ links });
  }
}
