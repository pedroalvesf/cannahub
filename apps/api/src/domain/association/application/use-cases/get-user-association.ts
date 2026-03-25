import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { AssociationMembersRepository } from '../repositories/association-members-repository';
import { NotAnAssociationMemberError } from './errors/not-association-member-error';

interface GetUserAssociationRequest {
  userId: string;
}

type GetUserAssociationResponse = Either<
  NotAnAssociationMemberError,
  { associationId: string; memberRole: string }
>;

@Injectable()
export class GetUserAssociationUseCase {
  constructor(
    private associationMembersRepository: AssociationMembersRepository,
  ) {}

  async execute(
    request: GetUserAssociationRequest,
  ): Promise<GetUserAssociationResponse> {
    const memberships =
      await this.associationMembersRepository.findByUserId(request.userId);

    const activeMembership = memberships.find(
      (m) => m.status === 'active',
    );

    if (!activeMembership) {
      return left(new NotAnAssociationMemberError());
    }

    return right({
      associationId: activeMembership.associationId.toString(),
      memberRole: activeMembership.role,
    });
  }
}
