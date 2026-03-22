import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { DeleteUsersUseCase } from '../delete-users';
import { makeUser } from '@/test/factories/make-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let usersRepository: InMemoryUsersRepository;
let sut: DeleteUsersUseCase;

describe('Delete Users', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new DeleteUsersUseCase(usersRepository);
  });

  it('should delete a single user', async () => {
    const userId = new UniqueEntityID();
    await usersRepository.create(makeUser({}, userId));

    const result = await sut.execute({ userIds: [userId.toString()] });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.deletedCount).toBe(1);
    }
    expect(usersRepository.items).toHaveLength(0);
  });

  it('should delete multiple users', async () => {
    const id1 = new UniqueEntityID();
    const id2 = new UniqueEntityID();
    const id3 = new UniqueEntityID();
    await usersRepository.create(makeUser({}, id1));
    await usersRepository.create(makeUser({}, id2));
    await usersRepository.create(makeUser({}, id3));

    const result = await sut.execute({
      userIds: [id1.toString(), id2.toString()],
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.deletedCount).toBe(2);
    }
    expect(usersRepository.items).toHaveLength(1);
    expect(usersRepository.items[0]?.id.toString()).toBe(id3.toString());
  });

  it('should skip non-existent users', async () => {
    const userId = new UniqueEntityID();
    await usersRepository.create(makeUser({}, userId));

    const result = await sut.execute({
      userIds: [userId.toString(), 'non-existent'],
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.deletedCount).toBe(1);
    }
  });
});
