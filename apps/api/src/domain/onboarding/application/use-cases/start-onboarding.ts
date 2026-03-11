import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { OnboardingSession } from '../../enterprise/entities/onboarding-session';
import { OnboardingSessionsRepository } from '../repositories/onboarding-sessions-repository';
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

    return right({ session });
  }
}
