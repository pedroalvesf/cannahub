import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CreateDiaryFollowUpUseCase } from '@/domain/diary/application/use-cases/create-diary-follow-up'
import { CreateDiaryFollowUpDto } from '../dto/create-diary-follow-up-dto'
import { DiaryEntryNotFoundError } from '@/domain/diary/application/use-cases/errors/diary-entry-not-found-error'
import { NotAllowedError } from '@/domain/diary/application/use-cases/errors/not-allowed-error'
import { InvalidDiaryEntryError } from '@/domain/diary/application/use-cases/errors/invalid-diary-entry-error'

@Controller('diary/entries')
@UseGuards(JwtAuthGuard)
export class CreateDiaryFollowUpController {
  constructor(private createDiaryFollowUp: CreateDiaryFollowUpUseCase) {}

  @Post(':id/follow-ups')
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() body: CreateDiaryFollowUpDto,
  ) {
    const result = await this.createDiaryFollowUp.execute({
      entryId: id,
      userId: user.sub,
      evaluatedAt: new Date(body.evaluatedAt),
      notes: body.notes,
      tags: body.tags,
      symptomAssessments: body.symptomAssessments,
      effects: body.effects,
    })

    if (result.isLeft()) {
      if (result.value instanceof DiaryEntryNotFoundError) {
        throw new NotFoundException(result.value.message)
      }
      if (result.value instanceof NotAllowedError) {
        throw new ForbiddenException(result.value.message)
      }
      if (result.value instanceof InvalidDiaryEntryError) {
        throw new BadRequestException(result.value.message)
      }
    }

    if (result.isRight()) {
      return {
        id: result.value.followUp.id.toString(),
        evaluatedAt: result.value.followUp.evaluatedAt,
      }
    }
  }
}
