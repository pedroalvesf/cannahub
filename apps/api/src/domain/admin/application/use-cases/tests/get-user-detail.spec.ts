import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { InMemoryOnboardingSessionsRepository } from '@/test/repositories/in-memory-onboarding-sessions-repository';
import { InMemoryDocumentsRepository } from '@/test/repositories/in-memory-documents-repository';
import { GetUserDetailUseCase } from '../get-user-detail';
import { makeUser } from '@/test/factories/make-user';
import { makeOnboardingSession } from '@/test/factories/make-onboarding-session';
import { makeDocument } from '@/test/factories/make-document';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let usersRepository: InMemoryUsersRepository;
let onboardingRepository: InMemoryOnboardingSessionsRepository;
let documentsRepository: InMemoryDocumentsRepository;
let sut: GetUserDetailUseCase;

describe('Get User Detail', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    onboardingRepository = new InMemoryOnboardingSessionsRepository();
    documentsRepository = new InMemoryDocumentsRepository();
    sut = new GetUserDetailUseCase(
      usersRepository,
      onboardingRepository,
      documentsRepository,
    );
  });

  it('should return user with onboarding and documents', async () => {
    const userId = new UniqueEntityID();
    const user = makeUser({}, userId);
    await usersRepository.create(user);

    const session = makeOnboardingSession({ userId });
    await onboardingRepository.create(session);

    const doc = makeDocument({ userId });
    await documentsRepository.create(doc);

    const result = await sut.execute({ userId: userId.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user.id.toString()).toBe(userId.toString());
      expect(result.value.onboarding).not.toBeNull();
      expect(result.value.documents).toHaveLength(1);
    }
  });

  it('should return user with null onboarding when not started', async () => {
    const userId = new UniqueEntityID();
    const user = makeUser({}, userId);
    await usersRepository.create(user);

    const result = await sut.execute({ userId: userId.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.onboarding).toBeNull();
      expect(result.value.documents).toHaveLength(0);
    }
  });

  it('should return error when user not found', async () => {
    const result = await sut.execute({ userId: 'non-existent-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
