import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { GetUserDetailUseCase } from '@/domain/admin/application/use-cases/get-user-detail';
import { UserNotFoundError } from '@/domain/admin/application/use-cases/errors/user-not-found-error';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('admin_users', 'read')
export class AdminGetUserDetailController {
  constructor(private getUserDetail: GetUserDetailUseCase) {}

  @Get(':id')
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const result = await this.getUserDetail.execute({ userId: id });

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    const { user, onboarding, documents } = result.value;

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        accountType: user.accountType,
        accountStatus: user.accountStatus,
        onboardingStatus: user.onboardingStatus,
        documentsStatus: user.documentsStatus,
        createdAt: user.createdAt,
      },
      onboarding: onboarding
        ? {
            status: onboarding.status,
            condition: onboarding.condition,
            experience: onboarding.experience,
            currentAccessMethod: onboarding.currentAccessMethod,
            preferredForm: onboarding.preferredForm,
            hasPrescription: onboarding.hasPrescription,
            assistedAccess: onboarding.assistedAccess,
            summary: onboarding.summary,
          }
        : null,
      documents: documents.map((doc: any) => ({
        id: doc.id.toString(),
        type: doc.type,
        url: doc.url,
        status: doc.status,
        rejectionReason: doc.rejectionReason,
        reviewedBy: doc.reviewedBy?.toString(),
        reviewedAt: doc.reviewedAt,
        createdAt: doc.createdAt,
      })),
    };
  }
}
