import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { AssociationsRepository } from '../repositories/associations-repository';
import { Association } from '../../enterprise/entities/association';
import { AssociationNotFoundError } from './errors/association-not-found-error';

interface GetAssociationProfileRequest {
  associationId: string;
}

type GetAssociationProfileResponse = Either<
  AssociationNotFoundError,
  { association: Association }
>;

@Injectable()
export class GetAssociationProfileUseCase {
  constructor(private associationsRepository: AssociationsRepository) {}

  async execute(
    request: GetAssociationProfileRequest,
  ): Promise<GetAssociationProfileResponse> {
    const association = await this.associationsRepository.findById(
      request.associationId,
    );

    if (!association) {
      return left(new AssociationNotFoundError(request.associationId));
    }

    return right({ association });
  }
}
