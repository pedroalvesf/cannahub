import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { OnboardingSession } from '../../enterprise/entities/onboarding-session';
import { OnboardingSessionsRepository } from '../repositories/onboarding-sessions-repository';
import { AiExtractor } from '../ai/ai-extractor';
import { SessionNotFoundError } from './errors/session-not-found-error';
import { SessionAlreadyCompletedError } from './errors/session-already-completed-error';

interface CompleteOnboardingRequest {
  userId: string;
}

type CompleteOnboardingResponse = Either<
  SessionNotFoundError | SessionAlreadyCompletedError,
  { session: OnboardingSession }
>;

@Injectable()
export class CompleteOnboardingUseCase {
  constructor(
    private onboardingSessionsRepository: OnboardingSessionsRepository,
    private aiExtractor: AiExtractor,
  ) {}

  async execute({
    userId,
  }: CompleteOnboardingRequest): Promise<CompleteOnboardingResponse> {
    const session =
      await this.onboardingSessionsRepository.findByUserId(userId);

    if (!session) {
      return left(new SessionNotFoundError());
    }

    if (session.status === 'completed') {
      return left(new SessionAlreadyCompletedError());
    }

    // Gera resumo com IA baseado nos dados coletados
    const summaryData = {
      condition: session.condition,
      accountType: session.accountType,
      experience: session.experience,
      preferredForm: session.preferredForm,
      hasPrescription: session.hasPrescription,
      assistedAccess: session.assistedAccess,
      growingInterest: session.growingInterest,
    };

    const summary = await this.aiExtractor.generateSummary(summaryData);
    session.setSummary(summary);

    if (session.hasPrescription === false) {
      session.awaitPrescription();
    } else {
      session.complete();
    }

    await this.onboardingSessionsRepository.save(session);

    return right({ session });
  }
}
