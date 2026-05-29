import {
  Controller,
  Delete,
  Param,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteDiaryFollowUpUseCase } from '@/domain/diary/application/use-cases/delete-diary-follow-up'
import { DiaryEntryNotFoundError } from '@/domain/diary/application/use-cases/errors/diary-entry-not-found-error'
import { NotAllowedError } from '@/domain/diary/application/use-cases/errors/not-allowed-error'

@Controller('diary/follow-ups')
@UseGuards(JwtAuthGuard)
export class DeleteDiaryFollowUpController {
  constructor(private deleteDiaryFollowUp: DeleteDiaryFollowUpUseCase) {}

  @Delete(':id')
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const result = await this.deleteDiaryFollowUp.execute({
      followUpId: id,
      userId: user.sub,
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
