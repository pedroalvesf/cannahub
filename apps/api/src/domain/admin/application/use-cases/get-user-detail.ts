import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';
import { OnboardingSessionsRepository } from '@/domain/onboarding/application/repositories/onboarding-sessions-repository';
import { DocumentsRepository } from '@/domain/patient/application/repositories/documents-repository';
import { User } from '@/domain/auth/enterprise/entities/user';
import { OnboardingSession } from '@/domain/onboarding/enterprise/entities/onboarding-session';
import { Document } from '@/domain/patient/enterprise/entities/document';
import { UserNotFoundError } from './errors/user-not-found-error';

interface GetUserDetailRequest {
  userId: string;
}

type GetUserDetailResponse = Either<
  UserNotFoundError,
  { user: User; onboarding: OnboardingSession | null; documents: Document[] }
>;

@Injectable()
export class GetUserDetailUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private onboardingSessionsRepository: OnboardingSessionsRepository,
    private documentsRepository: DocumentsRepository,
  ) {}

  async execute({
    userId,
  }: GetUserDetailRequest): Promise<GetUserDetailResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const [onboarding, documents] = await Promise.all([
      this.onboardingSessionsRepository.findByUserId(userId),
      this.documentsRepository.findByUserId(userId),
    ]);

    return right({ user, onboarding, documents });
  }
}
