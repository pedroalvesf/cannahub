import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { AssociationsRepository } from '../repositories/associations-repository';
import { PatientAssociationLinksRepository } from '../repositories/patient-association-links-repository';
import { ProductsRepository } from '../repositories/products-repository';
import { AssociationNotFoundError } from './errors/association-not-found-error';

interface GetAssociationDashboardRequest {
  associationId: string;
}

interface DashboardData {
  associationName: string;
  membersCount: number;
  pendingLinksCount: number;
  productsCount: number;
}

type GetAssociationDashboardResponse = Either<
  AssociationNotFoundError,
  DashboardData
>;

@Injectable()
export class GetAssociationDashboardUseCase {
  constructor(
    private associationsRepository: AssociationsRepository,
    private linksRepository: PatientAssociationLinksRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute(
    request: GetAssociationDashboardRequest,
  ): Promise<GetAssociationDashboardResponse> {
    const association = await this.associationsRepository.findById(
      request.associationId,
    );

    if (!association) {
      return left(new AssociationNotFoundError(request.associationId));
    }

    const [membersCount, pendingLinksCount, productsCount] =
      await Promise.all([
        this.linksRepository.countByAssociationId(
          request.associationId,
          'active',
        ),
        this.linksRepository.countByAssociationId(
          request.associationId,
          'requested',
        ),
        this.productsRepository.countByAssociationId(
          request.associationId,
        ),
      ]);

    return right({
      associationName: association.name,
      membersCount,
      pendingLinksCount,
      productsCount,
    });
  }
}
