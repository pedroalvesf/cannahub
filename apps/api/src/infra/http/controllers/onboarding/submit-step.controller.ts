import {
  Controller,
  Patch,
  Body,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { SubmitStepUseCase } from '@/domain/onboarding/application/use-cases/submit-step';
import { SubmitStepDto } from '../dto/submit-step-dto';
import { SessionNotFoundError } from '@/domain/onboarding/application/use-cases/errors/session-not-found-error';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class SubmitStepController {
  constructor(private submitStep: SubmitStepUseCase) {}

  @Patch('step')
  async handle(@CurrentUser() user: UserPayload, @Body() body: SubmitStepDto) {
    const result = await this.submitStep.execute({
      userId: user.sub,
      stepNumber: body.stepNumber,
      input: body.input ?? '',
      selectedOption: body.selectedOption,
    });

    if (result.isLeft()) {
      if (result.value instanceof SessionNotFoundError) {
        throw new NotFoundException(result.value.message);
      }
      throw new BadRequestException(result.value.message);
    }

    const { session, extractedFields } = result.value;

    return {
      sessionId: session.id.toString(),
      status: session.status,
      currentStep: session.currentStep,
      extractedFields,
    };
  }
}
