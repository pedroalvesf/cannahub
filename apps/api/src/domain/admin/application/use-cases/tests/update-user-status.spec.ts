import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { UpdateUserStatusUseCase } from '../update-user-status';
import { makeUser } from '@/test/factories/make-user';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let usersRepository: InMemoryUsersRepository;
let sut: UpdateUserStatusUseCase;

describe('Update User Status', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateUserStatusUseCase(usersRepository);
  });

  it('should approve a user', async () => {
    const userId = new UniqueEntityID();
    const user = makeUser({ accountStatus: 'pending' }, userId);
    await usersRepository.create(user);

    const result = await sut.execute({
      userId: userId.toString(),
      accountStatus: 'approved',
    });

    expect(result.isRight()).toBe(true);
    const updatedUser = await usersRepository.findById(userId.toString());
    expect(updatedUser?.accountStatus).toBe('approved');
  });

  it('should reject a user', async () => {
    const userId = new UniqueEntityID();
    const user = makeUser({ accountStatus: 'pending' }, userId);
    await usersRepository.create(user);

    const result = await sut.execute({
      userId: userId.toString(),
      accountStatus: 'rejected',
    });

    expect(result.isRight()).toBe(true);
    const updatedUser = await usersRepository.findById(userId.toString());
    expect(updatedUser?.accountStatus).toBe('rejected');
  });

  it('should return error when user not found', async () => {
    const result = await sut.execute({
      userId: 'non-existent',
      accountStatus: 'approved',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
