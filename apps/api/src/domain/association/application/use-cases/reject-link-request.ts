import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { PatientAssociationLinksRepository } from '../repositories/patient-association-links-repository';
import { LinkNotFoundError } from './errors/link-not-found-error';
import { NotAuthorizedForAssociationError } from './errors/not-authorized-for-association-error';

interface RejectLinkRequestInput {
  linkId: string;
  associationId: string;
}

type RejectLinkRequestResponse = Either<
  LinkNotFoundError | NotAuthorizedForAssociationError,
  null
>;

@Injectable()
export class RejectLinkRequestUseCase {
  constructor(
    private linksRepository: PatientAssociationLinksRepository,
  ) {}

  async execute(
    request: RejectLinkRequestInput,
  ): Promise<RejectLinkRequestResponse> {
    const link = await this.linksRepository.findById(request.linkId);

    if (!link) {
      return left(new LinkNotFoundError(request.linkId));
    }

    if (link.associationId.toString() !== request.associationId) {
      return left(new NotAuthorizedForAssociationError());
    }

    link.reject();

    await this.linksRepository.save(link);

    return right(null);
  }
}
