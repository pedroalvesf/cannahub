import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '../repositories/users-repository';
import { UserNotFoundError } from './errors/user-not-found-error';
import { User } from '../../enterprise/entities/user';

interface UpdateProfileRequest {
  userId: string;
  name?: string;
  phone?: string;
  cpf?: string;
}

type UpdateProfileResponse = Either<UserNotFoundError, { user: User }>;

@Injectable()
export class UpdateProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(request: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const user = await this.usersRepository.findById(request.userId);

    if (!user) {
      return left(new UserNotFoundError(request.userId));
    }

    if (request.name !== undefined) {
      user.name = request.name;
    }

    if (request.phone !== undefined) {
      user.phone = request.phone || undefined;
    }

    if (request.cpf !== undefined) {
      user.cpf = request.cpf || undefined;
    }

    await this.usersRepository.save(user);

    return right({ user });
  }
}
