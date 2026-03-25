import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PatientAssociationLinksRepository } from '../repositories/patient-association-links-repository';
import { LinkNotFoundError } from './errors/link-not-found-error';
import { NotAuthorizedForAssociationError } from './errors/not-authorized-for-association-error';

interface ApproveLinkRequestInput {
  linkId: string;
  associationId: string;
  approvedByUserId: string;
}

type ApproveLinkRequestResponse = Either<
  LinkNotFoundError | NotAuthorizedForAssociationError,
  null
>;

@Injectable()
export class ApproveLinkRequestUseCase {
  constructor(
    private linksRepository: PatientAssociationLinksRepository,
  ) {}

  async execute(
    request: ApproveLinkRequestInput,
  ): Promise<ApproveLinkRequestResponse> {
    const link = await this.linksRepository.findById(request.linkId);

    if (!link) {
      return left(new LinkNotFoundError(request.linkId));
    }

    if (link.associationId.toString() !== request.associationId) {
      return left(new NotAuthorizedForAssociationError());
    }

    link.approve(new UniqueEntityID(request.approvedByUserId));

    await this.linksRepository.save(link);

    return right(null);
  }
}
