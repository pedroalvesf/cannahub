import { Controller, ForbiddenException, Get, HttpCode, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetUserAssociationUseCase } from '@/domain/association/application/use-cases/get-user-association';
import { GetAssociationDashboardUseCase } from '@/domain/association/application/use-cases/get-association-dashboard';

@Controller('association/dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('association_profile', 'read')
export class AssociationDashboardController {
  constructor(
    private getUserAssociation: GetUserAssociationUseCase,
    private getDashboard: GetAssociationDashboardUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const assocResult = await this.getUserAssociation.execute({ userId: user.sub });
    if (assocResult.isLeft()) throw new ForbiddenException();

    const result = await this.getDashboard.execute({
      associationId: assocResult.value.associationId,
    });

    if (result.isLeft()) throw new ForbiddenException();

    return result.value;
  }
}
