import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { ListUsersUseCase } from '@/domain/admin/application/use-cases/list-users';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('admin_users', 'read')
export class AdminListUsersController {
  constructor(private listUsers: ListUsersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('accountStatus') accountStatus?: string,
    @Query('accountType') accountType?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const result = await this.listUsers.execute({
      accountStatus,
      accountType,
      search,
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
    });

    // ListUsersUseCase never returns Left, so result is always Right
    const { users, total, page: currentPage, perPage: currentPerPage } = result.value;

    return {
      users: users.map((user) => ({
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        cpf: user.cpf,
        accountType: user.accountType,
        accountStatus: user.accountStatus,
        onboardingStatus: user.onboardingStatus,
        documentsStatus: user.documentsStatus,
        createdAt: user.createdAt,
      })),
      total,
      page: currentPage,
      perPage: currentPerPage,
    };
  }
}
