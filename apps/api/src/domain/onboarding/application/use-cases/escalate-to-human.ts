import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { SupportTicket } from '../../enterprise/entities/support-ticket';
import { OnboardingSessionsRepository } from '../repositories/onboarding-sessions-repository';
import { SupportTicketsRepository } from '../repositories/support-tickets-repository';
import { SessionNotFoundError } from './errors/session-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface EscalateToHumanRequest {
  userId: string;
  reason: string;
}

type EscalateToHumanResponse = Either<
  SessionNotFoundError,
  { ticket: SupportTicket }
>;

@Injectable()
export class EscalateToHumanUseCase {
  constructor(
    private onboardingSessionsRepository: OnboardingSessionsRepository,
    private supportTicketsRepository: SupportTicketsRepository,
  ) {}

  async execute({
    userId,
    reason,
  }: EscalateToHumanRequest): Promise<EscalateToHumanResponse> {
    const session =
      await this.onboardingSessionsRepository.findByUserId(userId);

    if (!session) {
      return left(new SessionNotFoundError());
    }

    session.escalate(reason);
    await this.onboardingSessionsRepository.save(session);

    const ticket = SupportTicket.create({
      sessionId: session.id,
      context: {
        condition: session.condition,
        accountType: session.accountType,
        experience: session.experience,
        preferredForm: session.preferredForm,
        hasPrescription: session.hasPrescription,
        currentStep: session.currentStep,
        rawResponses: session.rawResponses,
        escalationReason: reason,
      },
    });

    await this.supportTicketsRepository.create(ticket);

    return right({ ticket });
  }
}
