import { describe, it, expect, beforeEach } from 'vitest';
import { StartOnboardingUseCase } from '../start-onboarding';
import { InMemoryOnboardingSessionsRepository } from '@/test/repositories/in-memory-onboarding-sessions-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { makeOnboardingSession } from '@/test/factories/make-onboarding-session';
import { makeUser } from '@/test/factories/make-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { SessionAlreadyExistsError } from '../errors/session-already-exists-error';

let repository: InMemoryOnboardingSessionsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: StartOnboardingUseCase;

describe('StartOnboardingUseCase', () => {
  beforeEach(() => {
    repository = new InMemoryOnboardingSessionsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new StartOnboardingUseCase(repository, usersRepository);
  });

  it('should create a new onboarding session', async () => {
    const userId = new UniqueEntityID('user-1');
    await usersRepository.create(makeUser({}, userId));

    const result = await sut.execute({ userId: 'user-1' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.session.userId.toString()).toBe('user-1');
      expect(result.value.session.status).toBe('in_progress');
      expect(result.value.session.currentStep).toBe(1);
    }
    expect(repository.items).toHaveLength(1);

    const user = await usersRepository.findById('user-1');
    expect(user?.onboardingStatus).toBe('in_progress');
  });

  it('should return error if session already exists for user', async () => {
    const userId = new UniqueEntityID('user-1');
    const existing = makeOnboardingSession({ userId });
    repository.items.push(existing);

    const result = await sut.execute({ userId: 'user-1' });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SessionAlreadyExistsError);
    }
  });
});
