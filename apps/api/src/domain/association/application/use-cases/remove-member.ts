import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { PatientAssociationLinksRepository } from '../repositories/patient-association-links-repository';
import { LinkNotFoundError } from './errors/link-not-found-error';
import { NotAuthorizedForAssociationError } from './errors/not-authorized-for-association-error';

interface RemoveMemberRequest {
  linkId: string;
  associationId: string;
}

type RemoveMemberResponse = Either<
  LinkNotFoundError | NotAuthorizedForAssociationError,
  null
>;

@Injectable()
export class RemoveMemberUseCase {
  constructor(
    private linksRepository: PatientAssociationLinksRepository,
  ) {}

  async execute(
    request: RemoveMemberRequest,
  ): Promise<RemoveMemberResponse> {
    const link = await this.linksRepository.findById(request.linkId);

    if (!link) {
      return left(new LinkNotFoundError(request.linkId));
    }

    if (link.associationId.toString() !== request.associationId) {
      return left(new NotAuthorizedForAssociationError());
    }

    link.cancel();

    await this.linksRepository.save(link);

    return right(null);
  }
}
