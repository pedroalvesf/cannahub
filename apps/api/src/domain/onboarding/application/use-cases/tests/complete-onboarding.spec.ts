import { describe, it, expect, beforeEach } from 'vitest';
import { CompleteOnboardingUseCase } from '../complete-onboarding';
import { InMemoryOnboardingSessionsRepository } from '@/test/repositories/in-memory-onboarding-sessions-repository';
import { FakeAiExtractor } from '@/test/ai/fake-ai-extractor';
import { makeOnboardingSession } from '@/test/factories/make-onboarding-session';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { SessionNotFoundError } from '../errors/session-not-found-error';
import { SessionAlreadyCompletedError } from '../errors/session-already-completed-error';

let repository: InMemoryOnboardingSessionsRepository;
let aiExtractor: FakeAiExtractor;
let sut: CompleteOnboardingUseCase;

describe('CompleteOnboardingUseCase', () => {
  beforeEach(() => {
    repository = new InMemoryOnboardingSessionsRepository();
    aiExtractor = new FakeAiExtractor();
    sut = new CompleteOnboardingUseCase(repository, aiExtractor);
  });

  it('should complete onboarding and generate summary', async () => {
    const session = makeOnboardingSession({
      userId: new UniqueEntityID('user-1'),
      condition: 'chronic_pain',
      hasPrescription: true,
    });
    repository.items.push(session);

    const result = await sut.execute({ userId: 'user-1' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.session.status).toBe('completed');
      expect(result.value.session.summary).toBeDefined();
      expect(result.value.session.summary).toContain('chronic_pain');
    }
  });

  it('should set status to awaiting_prescription when no prescription', async () => {
    const session = makeOnboardingSession({
      userId: new UniqueEntityID('user-1'),
      condition: 'anxiety',
      hasPrescription: false,
    });
    repository.items.push(session);

    const result = await sut.execute({ userId: 'user-1' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.session.status).toBe('awaiting_prescription');
    }
  });

  it('should return error if session not found', async () => {
    const result = await sut.execute({ userId: 'nonexistent' });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SessionNotFoundError);
    }
  });

  it('should return error if session already completed', async () => {
    const session = makeOnboardingSession({
      userId: new UniqueEntityID('user-1'),
      status: 'completed',
    });
    repository.items.push(session);

    const result = await sut.execute({ userId: 'user-1' });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SessionAlreadyCompletedError);
    }
  });
});
