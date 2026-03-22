import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { OnboardingSession } from '../../enterprise/entities/onboarding-session';
import { OnboardingSessionsRepository } from '../repositories/onboarding-sessions-repository';
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';
import { SessionAlreadyExistsError } from './errors/session-already-exists-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface StartOnboardingRequest {
  userId: string;
}

type StartOnboardingResponse = Either<
  SessionAlreadyExistsError,
  { session: OnboardingSession }
>;

@Injectable()
export class StartOnboardingUseCase {
  constructor(
    private onboardingSessionsRepository: OnboardingSessionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: StartOnboardingRequest): Promise<StartOnboardingResponse> {
    const existing =
      await this.onboardingSessionsRepository.findByUserId(userId);

    if (existing) {
      return left(new SessionAlreadyExistsError());
    }

    const session = OnboardingSession.create({
      userId: new UniqueEntityID(userId),
    });

    await this.onboardingSessionsRepository.create(session);

    // Update user onboarding status
    const user = await this.usersRepository.findById(userId);
    if (user) {
      user.onboardingStatus = 'in_progress';
      await this.usersRepository.save(user);
    }

    return right({ session });
  }
}
