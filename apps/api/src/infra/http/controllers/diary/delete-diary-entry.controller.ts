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
import { DeleteDiaryEntryUseCase } from '@/domain/diary/application/use-cases/delete-diary-entry'
import { DiaryEntryNotFoundError } from '@/domain/diary/application/use-cases/errors/diary-entry-not-found-error'
import { NotAllowedError } from '@/domain/diary/application/use-cases/errors/not-allowed-error'

@Controller('diary')
@UseGuards(JwtAuthGuard)
export class DeleteDiaryEntryController {
  constructor(private deleteDiaryEntry: DeleteDiaryEntryUseCase) {}

  @Delete(':id')
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const result = await this.deleteDiaryEntry.execute({
      entryId: id,
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
