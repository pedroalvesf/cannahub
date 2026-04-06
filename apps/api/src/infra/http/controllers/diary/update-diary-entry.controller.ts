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
import { UpdateDiaryEntryUseCase } from '@/domain/diary/application/use-cases/update-diary-entry'
import { UpdateDiaryEntryDto } from '../dto/update-diary-entry-dto'
import { DiaryEntryNotFoundError } from '@/domain/diary/application/use-cases/errors/diary-entry-not-found-error'
import { NotAllowedError } from '@/domain/diary/application/use-cases/errors/not-allowed-error'

@Controller('diary')
@UseGuards(JwtAuthGuard)
export class UpdateDiaryEntryController {
  constructor(private updateDiaryEntry: UpdateDiaryEntryUseCase) {}

  @Patch(':id')
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() body: UpdateDiaryEntryDto,
  ) {
    const result = await this.updateDiaryEntry.execute({
      entryId: id,
      userId: user.sub,
      date: body.date ? new Date(body.date) : undefined,
      time: body.time,
      productId: body.productId,
      customProductName: body.customProductName,
      administrationMethod: body.administrationMethod,
      doseAmount: body.doseAmount,
      doseUnit: body.doseUnit,
      notes: body.notes,
      isFavorite: body.isFavorite,
      severityAfterUpdates: body.severityAfterUpdates,
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
