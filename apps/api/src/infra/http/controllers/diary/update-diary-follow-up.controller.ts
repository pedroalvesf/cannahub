import {
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UpdateDiaryFollowUpUseCase } from '@/domain/diary/application/use-cases/update-diary-follow-up'
import { UpdateDiaryFollowUpDto } from '../dto/create-diary-follow-up-dto'
import { DiaryEntryNotFoundError } from '@/domain/diary/application/use-cases/errors/diary-entry-not-found-error'
import { NotAllowedError } from '@/domain/diary/application/use-cases/errors/not-allowed-error'

@Controller('diary/follow-ups')
@UseGuards(JwtAuthGuard)
export class UpdateDiaryFollowUpController {
  constructor(private updateDiaryFollowUp: UpdateDiaryFollowUpUseCase) {}

  @Patch(':id')
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() body: UpdateDiaryFollowUpDto,
  ) {
    const result = await this.updateDiaryFollowUp.execute({
      followUpId: id,
      userId: user.sub,
      evaluatedAt: body.evaluatedAt ? new Date(body.evaluatedAt) : undefined,
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
    }

    return { success: true }
  }
}
