import {
  UsersRepository,
  RoleDTO,
  FindManyUsersParams,
} from '@/domain/auth/application/repositories/users-repository';
import { User } from '@/domain/auth/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];
  public userRoles: { userId: string; roleId: string; assignedBy?: string }[] =
    [];
  public roles: RoleDTO[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id);
    return user ?? null;
  }

  async findMany(params: FindManyUsersParams): Promise<{ users: User[]; total: number }> {
    const { accountStatus, accountType, search, page = 1, perPage = 20 } = params;

    let filtered = [...this.items];

    if (accountStatus) {
      filtered = filtered.filter((u) => u.accountStatus === accountStatus);
    }

    if (accountType) {
      filtered = filtered.filter((u) => u.accountType === accountType);
    }

    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower) ||
          u.cpf?.includes(search),
      );
    }

    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = filtered.length;
    const start = (page - 1) * perPage;
    const users = filtered.slice(start, start + perPage);

    return { users, total };
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = this.items.find((item) => item.cpf === cpf);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    return user ?? null;
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === user.id.toString()
    );

    if (itemIndex >= 0) {
      this.items[itemIndex] = user;
    }
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === id);

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1);
      this.userRoles = this.userRoles.filter(
        (userRole) => userRole.userId !== id
      );
    }
  }

  async assignRole(
    userId: string,
    roleId: string,
    assignedBy?: string
  ): Promise<void> {
    const existingAssignment = this.userRoles.find(
      (userRole) => userRole.userId === userId && userRole.roleId === roleId
    );

    if (!existingAssignment) {
      this.userRoles.push({
        userId,
        roleId,
        assignedBy,
      });
    }
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    const itemIndex = this.userRoles.findIndex(
      (userRole) => userRole.userId === userId && userRole.roleId === roleId
    );

    if (itemIndex >= 0) {
      this.userRoles.splice(itemIndex, 1);
    }
  }

  async findRolesByUserId(userId: string): Promise<RoleDTO[]> {
    const userRoleIds = this.userRoles
      .filter((userRole) => userRole.userId === userId)
      .map((userRole) => userRole.roleId);

    return this.roles.filter((role) => userRoleIds.includes(role.id));
  }

  addRole(role: RoleDTO): void {
    this.roles.push(role);
  }
}
