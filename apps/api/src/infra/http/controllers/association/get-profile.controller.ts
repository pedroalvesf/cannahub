import { Controller, ForbiddenException, Get, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetUserAssociationUseCase } from '@/domain/association/application/use-cases/get-user-association';
import { GetAssociationProfileUseCase } from '@/domain/association/application/use-cases/get-association-profile';
import { AssociationNotFoundError } from '@/domain/association/application/use-cases/errors/association-not-found-error';

@Controller('association/profile')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('association_profile', 'read')
export class AssociationGetProfileController {
  constructor(
    private getUserAssociation: GetUserAssociationUseCase,
    private getProfile: GetAssociationProfileUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const assocResult = await this.getUserAssociation.execute({ userId: user.sub });
    if (assocResult.isLeft()) throw new ForbiddenException();

    const result = await this.getProfile.execute({
      associationId: assocResult.value.associationId,
    });

    if (result.isLeft()) {
      if (result.value instanceof AssociationNotFoundError) {
        throw new NotFoundException(result.value.message);
      }
    }

    if (result.isRight()) {
      const a = result.value.association;
      return {
        id: a.id.toString(),
        name: a.name,
        cnpj: a.cnpj,
        status: a.status,
        description: a.description,
        region: a.region,
        state: a.state,
        city: a.city,
        profileTypes: a.profileTypes,
        hasAssistedAccess: a.hasAssistedAccess,
        contactEmail: a.contactEmail,
        contactPhone: a.contactPhone,
        website: a.website,
        logoUrl: a.logoUrl,
        membershipFee: a.membershipFee,
        membershipPeriod: a.membershipPeriod,
        membershipDescription: a.membershipDescription,
      };
    }
  }
}
