import { describe, it, expect, beforeEach } from 'vitest';
import { SubmitStepUseCase } from '../submit-step';
import { InMemoryOnboardingSessionsRepository } from '@/test/repositories/in-memory-onboarding-sessions-repository';
import { makeOnboardingSession } from '@/test/factories/make-onboarding-session';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { SessionNotFoundError } from '../errors/session-not-found-error';
import { SessionAlreadyCompletedError } from '../errors/session-already-completed-error';

let repository: InMemoryOnboardingSessionsRepository;
let sut: SubmitStepUseCase;

describe('SubmitStepUseCase', () => {
  beforeEach(() => {
    repository = new InMemoryOnboardingSessionsRepository();
    sut = new SubmitStepUseCase(repository);
  });

  it('should save a step with selected option', async () => {
    const session = makeOnboardingSession({
      userId: new UniqueEntityID('user-1'),
    });
    repository.items.push(session);

    const result = await sut.execute({
      userId: 'user-1',
      stepNumber: 1,
      input: '',
      selectedOption: 'chronic_pain',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.session.condition).toBe('chronic_pain');
      expect(result.value.session.currentStep).toBe(2);
      expect(result.value.session.rawResponses).toHaveLength(1);
    }
  });

  it('should save free text directly to the step field', async () => {
    const session = makeOnboardingSession({
      userId: new UniqueEntityID('user-1'),
    });
    repository.items.push(session);

    const result = await sut.execute({
      userId: 'user-1',
      stepNumber: 1,
      input: 'Meu filho tem epilepsia e nunca usou cannabis',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.extractedFields).toBeDefined();
      expect(result.value.session.condition).toBe(
        'Meu filho tem epilepsia e nunca usou cannabis',
      );
      expect(result.value.session.currentStep).toBe(2);
    }
  });

  it('should return error if session not found', async () => {
    const result = await sut.execute({
      userId: 'nonexistent',
      stepNumber: 1,
      input: 'dor crônica',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SessionNotFoundError);
    }
  });

  it('should return error if session is completed', async () => {
    const session = makeOnboardingSession({
      userId: new UniqueEntityID('user-1'),
      status: 'completed',
    });
    repository.items.push(session);

    const result = await sut.execute({
      userId: 'user-1',
      stepNumber: 1,
      input: '',
      selectedOption: 'anxiety',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SessionAlreadyCompletedError);
    }
  });
});
