import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Dependent } from '@/domain/patient/enterprise/entities/dependent';
import { DependentsRepository } from '../repositories/dependents-repository';

interface ListGuardianDependentsRequest {
  guardianUserId: string;
}

type ListGuardianDependentsResponse = Either<
  never,
  { dependents: Dependent[] }
>;

@Injectable()
export class ListGuardianDependentsUseCase {
  constructor(private dependentsRepository: DependentsRepository) {}

  async execute(
    request: ListGuardianDependentsRequest,
  ): Promise<ListGuardianDependentsResponse> {
    const dependents = await this.dependentsRepository.findByGuardianUserId(
      request.guardianUserId,
    );

    return right({ dependents });
  }
}
