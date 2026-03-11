import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { OnboardingSession } from '../../enterprise/entities/onboarding-session';
import { OnboardingSessionsRepository } from '../repositories/onboarding-sessions-repository';
import { SessionNotFoundError } from './errors/session-not-found-error';

interface GetOnboardingSummaryRequest {
  userId: string;
}

type GetOnboardingSummaryResponse = Either<
  SessionNotFoundError,
  { session: OnboardingSession }
>;

@Injectable()
export class GetOnboardingSummaryUseCase {
  constructor(
    private onboardingSessionsRepository: OnboardingSessionsRepository,
  ) {}

  async execute({
    userId,
  }: GetOnboardingSummaryRequest): Promise<GetOnboardingSummaryResponse> {
    const session =
      await this.onboardingSessionsRepository.findByUserId(userId);

    if (!session) {
      return left(new SessionNotFoundError());
    }

    return right({ session });
  }
}
