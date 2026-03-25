import { Controller, ForbiddenException, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetUserAssociationUseCase } from '@/domain/association/application/use-cases/get-user-association';
import { ListAssociationLinksUseCase } from '@/domain/association/application/use-cases/list-association-links';

@Controller('association/members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('association_members', 'read')
export class AssociationListMembersController {
  constructor(
    private getUserAssociation: GetUserAssociationUseCase,
    private listLinks: ListAssociationLinksUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('status') status?: string,
  ) {
    const assocResult = await this.getUserAssociation.execute({ userId: user.sub });
    if (assocResult.isLeft()) throw new ForbiddenException();

    const result = await this.listLinks.execute({
      associationId: assocResult.value.associationId,
      status,
    });

    return {
      links: result.value.links.map((link) => ({
        id: link.id.toString(),
        patientId: link.patientId.toString(),
        requestedByUserId: link.requestedByUserId.toString(),
        status: link.status,
        approvedByUserId: link.approvedByUserId?.toString(),
        startDate: link.startDate,
        endDate: link.endDate,
        feeStatus: link.feeStatus,
        feeExpiresAt: link.feeExpiresAt,
        feePaidAt: link.feePaidAt,
        createdAt: link.createdAt,
      })),
    };
  }
}
