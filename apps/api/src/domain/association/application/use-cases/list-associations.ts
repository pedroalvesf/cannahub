import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import {
  AssociationsRepository,
  AssociationFilters,
} from '../repositories/associations-repository';
import { Association } from '../../enterprise/entities/association';

interface ListAssociationsRequest {
  region?: string;
  state?: string;
  status?: string;
  hasAssistedAccess?: boolean;
}

type ListAssociationsResponse = Either<
  never,
  { associations: Association[] }
>;

@Injectable()
export class ListAssociationsUseCase {
  constructor(private associationsRepository: AssociationsRepository) {}

  async execute(
    request: ListAssociationsRequest,
  ): Promise<ListAssociationsResponse> {
    const filters: AssociationFilters = {};

    if (request.region) filters.region = request.region;
    if (request.state) filters.state = request.state;
    if (request.status) filters.status = request.status;
    if (request.hasAssistedAccess !== undefined)
      filters.hasAssistedAccess = request.hasAssistedAccess;

    const associations =
      await this.associationsRepository.findMany(filters);

    return right({ associations });
  }
}
