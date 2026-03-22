import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { ListUsersUseCase } from '../list-users';
import { makeUser } from '@/test/factories/make-user';

let usersRepository: InMemoryUsersRepository;
let sut: ListUsersUseCase;

describe('List Users', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ListUsersUseCase(usersRepository);
  });

  it('should list all users with pagination', async () => {
    for (let i = 0; i < 25; i++) {
      await usersRepository.create(makeUser());
    }

    const result = await sut.execute({ page: 1, perPage: 20 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(20);
      expect(result.value.total).toBe(25);
      expect(result.value.page).toBe(1);
      expect(result.value.perPage).toBe(20);
    }
  });

  it('should return second page', async () => {
    for (let i = 0; i < 25; i++) {
      await usersRepository.create(makeUser());
    }

    const result = await sut.execute({ page: 2, perPage: 20 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(5);
      expect(result.value.total).toBe(25);
    }
  });

  it('should filter by accountStatus', async () => {
    await usersRepository.create(makeUser({ accountStatus: 'pending' }));
    await usersRepository.create(makeUser({ accountStatus: 'approved' }));
    await usersRepository.create(makeUser({ accountStatus: 'pending' }));

    const result = await sut.execute({ accountStatus: 'pending' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(2);
      expect(result.value.total).toBe(2);
    }
  });

  it('should filter by accountType', async () => {
    await usersRepository.create(makeUser({ accountType: 'patient' }));
    await usersRepository.create(makeUser({ accountType: 'guardian' }));
    await usersRepository.create(makeUser({ accountType: 'patient' }));

    const result = await sut.execute({ accountType: 'patient' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(2);
    }
  });

  it('should search by name', async () => {
    await usersRepository.create(makeUser({ name: 'Maria Silva' }));
    await usersRepository.create(makeUser({ name: 'Joao Santos' }));
    await usersRepository.create(makeUser({ name: 'Maria Souza' }));

    const result = await sut.execute({ search: 'Maria' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(2);
    }
  });

  it('should search by email', async () => {
    await usersRepository.create(makeUser({ email: 'maria@test.com' }));
    await usersRepository.create(makeUser({ email: 'joao@test.com' }));

    const result = await sut.execute({ search: 'maria' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(1);
    }
  });
});
