import { describe, it, expect, beforeEach } from 'vitest';
import { EscalateToHumanUseCase } from '../escalate-to-human';
import { InMemoryOnboardingSessionsRepository } from '@/test/repositories/in-memory-onboarding-sessions-repository';
import { InMemorySupportTicketsRepository } from '@/test/repositories/in-memory-support-tickets-repository';
import { makeOnboardingSession } from '@/test/factories/make-onboarding-session';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { SessionNotFoundError } from '../errors/session-not-found-error';

let sessionsRepository: InMemoryOnboardingSessionsRepository;
let ticketsRepository: InMemorySupportTicketsRepository;
let sut: EscalateToHumanUseCase;

describe('EscalateToHumanUseCase', () => {
  beforeEach(() => {
    sessionsRepository = new InMemoryOnboardingSessionsRepository();
    ticketsRepository = new InMemorySupportTicketsRepository();
    sut = new EscalateToHumanUseCase(sessionsRepository, ticketsRepository);
  });

  it('should create support ticket and escalate session', async () => {
    const session = makeOnboardingSession({
      userId: new UniqueEntityID('user-1'),
      condition: 'epilepsy',
      currentStep: 3,
    });
    sessionsRepository.items.push(session);

    const result = await sut.execute({
      userId: 'user-1',
      reason: 'Preciso de ajuda humana',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.ticket.status).toBe('open');
      expect(result.value.ticket.context).toHaveProperty('escalationReason');
    }

    // Session should be escalated
    const updatedSession = sessionsRepository.items[0];
    expect(updatedSession.status).toBe('escalated');
    expect(updatedSession.escalatedReason).toBe('Preciso de ajuda humana');

    // Ticket should be created
    expect(ticketsRepository.items).toHaveLength(1);
  });

  it('should return error if session not found', async () => {
    const result = await sut.execute({
      userId: 'nonexistent',
      reason: 'Preciso de ajuda',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SessionNotFoundError);
    }
  });
});
