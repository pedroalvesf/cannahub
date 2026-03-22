import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';

interface DeleteUsersRequest {
  userIds: string[];
}

type DeleteUsersResponse = Either<never, { deletedCount: number }>;

@Injectable()
export class DeleteUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userIds,
  }: DeleteUsersRequest): Promise<DeleteUsersResponse> {
    let deletedCount = 0;

    for (const id of userIds) {
      const user = await this.usersRepository.findById(id);
      if (user) {
        await this.usersRepository.delete(id);
        deletedCount++;
      }
    }

    return right({ deletedCount });
  }
}
