import {
  Body,
  Controller,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { DeleteUsersUseCase } from '@/domain/admin/application/use-cases/delete-users';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('admin_users', 'update')
export class AdminDeleteUsersController {
  constructor(private deleteUsers: DeleteUsersUseCase) {}

  @Delete()
  @HttpCode(200)
  async handle(@Body() body: { userIds: string[] }) {
    const result = await this.deleteUsers.execute({ userIds: body.userIds });
    const { deletedCount } = result.value;
    return { deletedCount };
  }
}
