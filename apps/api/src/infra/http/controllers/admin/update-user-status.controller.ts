import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { UpdateUserStatusUseCase } from '@/domain/admin/application/use-cases/update-user-status';
import { UserNotFoundError } from '@/domain/admin/application/use-cases/errors/user-not-found-error';
import { UpdateUserStatusDto } from '../dto/update-user-status-dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('admin_users', 'update')
export class AdminUpdateUserStatusController {
  constructor(private updateUserStatus: UpdateUserStatusUseCase) {}

  @Patch(':id/status')
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @Body() body: UpdateUserStatusDto,
  ) {
    const result = await this.updateUserStatus.execute({
      userId: id,
      accountStatus: body.accountStatus,
    });

    if (result.isLeft()) {
      if (result.value instanceof UserNotFoundError) {
        throw new NotFoundException(result.value.message);
      }
    }
  }
}
