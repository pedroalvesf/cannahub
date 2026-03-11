import {
  Controller,
  Get,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetOnboardingSummaryUseCase } from '@/domain/onboarding/application/use-cases/get-onboarding-summary';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class GetOnboardingSummaryController {
  constructor(private getOnboardingSummary: GetOnboardingSummaryUseCase) {}

  @Get('summary')
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.getOnboardingSummary.execute({
      userId: user.sub,
    });

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    const { session } = result.value;

    return {
      sessionId: session.id.toString(),
      status: session.status,
      currentStep: session.currentStep,
      condition: session.condition,
      accountType: session.accountType,
      experience: session.experience,
      preferredForm: session.preferredForm,
      hasPrescription: session.hasPrescription,
      needsDoctor: session.needsDoctor,
      assistedAccess: session.assistedAccess,
      growingInterest: session.growingInterest,
      summary: session.summary,
    };
  }
}
