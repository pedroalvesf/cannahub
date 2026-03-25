import { Body, Controller, ForbiddenException, HttpCode, NotFoundException, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetUserAssociationUseCase } from '@/domain/association/application/use-cases/get-user-association';
import { UpdateAssociationProfileUseCase } from '@/domain/association/application/use-cases/update-association-profile';
import { UpdateAssociationProfileDto } from '../dto/update-association-profile-dto';
import { AssociationNotFoundError } from '@/domain/association/application/use-cases/errors/association-not-found-error';

@Controller('association/profile')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('association_profile', 'update')
export class AssociationUpdateProfileController {
  constructor(
    private getUserAssociation: GetUserAssociationUseCase,
    private updateProfile: UpdateAssociationProfileUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: UpdateAssociationProfileDto,
  ) {
    const assocResult = await this.getUserAssociation.execute({ userId: user.sub });
    if (assocResult.isLeft()) throw new ForbiddenException();

    const result = await this.updateProfile.execute({
      associationId: assocResult.value.associationId,
      ...body,
    });

    if (result.isLeft()) {
      if (result.value instanceof AssociationNotFoundError) {
        throw new NotFoundException(result.value.message);
      }
    }

    if (result.isRight()) {
      return { message: 'Profile updated successfully' };
    }
  }
}
