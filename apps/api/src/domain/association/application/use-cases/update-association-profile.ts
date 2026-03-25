import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { AssociationsRepository } from '../repositories/associations-repository';
import { Association } from '../../enterprise/entities/association';
import { AssociationNotFoundError } from './errors/association-not-found-error';

interface UpdateAssociationProfileRequest {
  associationId: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  logoUrl?: string;
  membershipFee?: number;
  membershipPeriod?: string;
  membershipDescription?: string;
}

type UpdateAssociationProfileResponse = Either<
  AssociationNotFoundError,
  { association: Association }
>;

@Injectable()
export class UpdateAssociationProfileUseCase {
  constructor(private associationsRepository: AssociationsRepository) {}

  async execute(
    request: UpdateAssociationProfileRequest,
  ): Promise<UpdateAssociationProfileResponse> {
    const association = await this.associationsRepository.findById(
      request.associationId,
    );

    if (!association) {
      return left(new AssociationNotFoundError(request.associationId));
    }

    association.updateProfile({
      description: request.description,
      contactEmail: request.contactEmail,
      contactPhone: request.contactPhone,
      website: request.website,
      logoUrl: request.logoUrl,
      membershipFee: request.membershipFee,
      membershipPeriod: request.membershipPeriod,
      membershipDescription: request.membershipDescription,
    });

    await this.associationsRepository.save(association);

    return right({ association });
  }
}
