import {
  Controller,
  Post,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CompleteOnboardingUseCase } from '@/domain/onboarding/application/use-cases/complete-onboarding';
import { SessionNotFoundError } from '@/domain/onboarding/application/use-cases/errors/session-not-found-error';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class CompleteOnboardingController {
  constructor(private completeOnboarding: CompleteOnboardingUseCase) {}

  @Post('complete')
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.completeOnboarding.execute({
      userId: user.sub,
    });

    if (result.isLeft()) {
      if (result.value instanceof SessionNotFoundError) {
        throw new NotFoundException(result.value.message);
      }
      throw new BadRequestException(result.value.message);
    }

    const { session } = result.value;

    return {
      sessionId: session.id.toString(),
      status: session.status,
      summary: session.summary,
      condition: session.condition,
      experience: session.experience,
      preferredForm: session.preferredForm,
      hasPrescription: session.hasPrescription,
      needsDoctor: session.needsDoctor,
      assistedAccess: session.assistedAccess,
    };
  }
}
