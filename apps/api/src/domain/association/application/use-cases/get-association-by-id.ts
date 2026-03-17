import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { AssociationsRepository } from '../repositories/associations-repository';
import { Association } from '../../enterprise/entities/association';

export class AssociationNotFoundError extends Error {
  constructor(id: string) {
    super(`Association "${id}" not found.`);
  }
}

interface GetAssociationByIdRequest {
  associationId: string;
}

type GetAssociationByIdResponse = Either<
  AssociationNotFoundError,
  { association: Association }
>;

@Injectable()
export class GetAssociationByIdUseCase {
  constructor(private associationsRepository: AssociationsRepository) {}

  async execute(
    request: GetAssociationByIdRequest,
  ): Promise<GetAssociationByIdResponse> {
    const association = await this.associationsRepository.findById(
      request.associationId,
    );

    if (!association) {
      return left(new AssociationNotFoundError(request.associationId));
    }

    return right({ association });
  }
}
