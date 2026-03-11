import {
  Controller,
  Post,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { StartOnboardingUseCase } from '@/domain/onboarding/application/use-cases/start-onboarding';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class StartOnboardingController {
  constructor(private startOnboarding: StartOnboardingUseCase) {}

  @Post('start')
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.startOnboarding.execute({
      userId: user.sub,
    });

    if (result.isLeft()) {
      throw new ConflictException(result.value.message);
    }

    const { session } = result.value;

    return {
      sessionId: session.id.toString(),
      status: session.status,
      currentStep: session.currentStep,
    };
  }
}
