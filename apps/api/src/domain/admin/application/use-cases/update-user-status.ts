import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';
import { UserNotFoundError } from './errors/user-not-found-error';

interface UpdateUserStatusRequest {
  userId: string;
  accountStatus: 'approved' | 'rejected';
}

type UpdateUserStatusResponse = Either<UserNotFoundError, null>;

@Injectable()
export class UpdateUserStatusUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    accountStatus,
  }: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    user.accountStatus = accountStatus;
    await this.usersRepository.save(user);

    return right(null);
  }
}
