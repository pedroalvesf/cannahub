import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';
import { User } from '@/domain/auth/enterprise/entities/user';

interface ListUsersRequest {
  accountStatus?: string;
  accountType?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

type ListUsersResponse = Either<
  never,
  { users: User[]; total: number; page: number; perPage: number }
>;

@Injectable()
export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(request: ListUsersRequest): Promise<ListUsersResponse> {
    const page = request.page ?? 1;
    const perPage = request.perPage ?? 20;

    const { users, total } = await this.usersRepository.findMany({
      accountStatus: request.accountStatus,
      accountType: request.accountType,
      search: request.search,
      page,
      perPage,
    });

    return right({ users, total, page, perPage });
  }
}
