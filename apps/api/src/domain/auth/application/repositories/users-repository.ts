import { User } from '@/domain/auth/enterprise/entities/user';

export interface RoleDTO {
  id: string;
  slug: string;
  name: string;
}

export interface FindManyUsersParams {
  accountStatus?: string;
  accountType?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findMany(params: FindManyUsersParams): Promise<{ users: User[]; total: number }>;
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract assignRole(
    userId: string,
    roleId: string,
    assignedBy?: string
  ): Promise<void>;
  abstract removeRole(userId: string, roleId: string): Promise<void>;
  abstract findRolesByUserId(userId: string): Promise<RoleDTO[]>;
}
