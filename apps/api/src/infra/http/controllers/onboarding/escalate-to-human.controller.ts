import {
  Controller,
  Post,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { EscalateToHumanUseCase } from '@/domain/onboarding/application/use-cases/escalate-to-human';
import { EscalateDto } from '../dto/escalate-dto';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class EscalateToHumanController {
  constructor(private escalateToHuman: EscalateToHumanUseCase) {}

  @Post('escalate')
  async handle(@CurrentUser() user: UserPayload, @Body() body: EscalateDto) {
    const result = await this.escalateToHuman.execute({
      userId: user.sub,
      reason: body.reason,
    });

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    const { ticket } = result.value;

    return {
      ticketId: ticket.id.toString(),
      status: ticket.status,
      message:
        'Sua solicitação foi encaminhada para um atendente. Entraremos em contato em breve.',
    };
  }
}
