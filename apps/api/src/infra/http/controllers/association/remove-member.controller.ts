import { Controller, Delete, ForbiddenException, HttpCode, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetUserAssociationUseCase } from '@/domain/association/application/use-cases/get-user-association';
import { RemoveMemberUseCase } from '@/domain/association/application/use-cases/remove-member';
import { LinkNotFoundError } from '@/domain/association/application/use-cases/errors/link-not-found-error';
import { NotAuthorizedForAssociationError } from '@/domain/association/application/use-cases/errors/not-authorized-for-association-error';

@Controller('association/members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('association_members', 'update')
export class AssociationRemoveMemberController {
  constructor(
    private getUserAssociation: GetUserAssociationUseCase,
    private removeMember: RemoveMemberUseCase,
  ) {}

  @Delete(':id')
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const assocResult = await this.getUserAssociation.execute({ userId: user.sub });
    if (assocResult.isLeft()) throw new ForbiddenException();

    const result = await this.removeMember.execute({
      linkId: id,
      associationId: assocResult.value.associationId,
    });

    if (result.isLeft()) {
      if (result.value instanceof LinkNotFoundError) {
        throw new NotFoundException(result.value.message);
      }
      if (result.value instanceof NotAuthorizedForAssociationError) {
        throw new ForbiddenException(result.value.message);
      }
    }
  }
}
