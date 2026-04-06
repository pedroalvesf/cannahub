import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { GetDiaryEntryUseCase } from '@/domain/diary/application/use-cases/get-diary-entry'
import { DiaryEntryNotFoundError } from '@/domain/diary/application/use-cases/errors/diary-entry-not-found-error'
import { NotAllowedError } from '@/domain/diary/application/use-cases/errors/not-allowed-error'

@Controller('diary')
@UseGuards(JwtAuthGuard)
export class GetDiaryEntryController {
  constructor(private getDiaryEntry: GetDiaryEntryUseCase) {}

  @Get(':id')
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const result = await this.getDiaryEntry.execute({
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

    const e = result.value as { entry: any }
    const entry = e.entry
    return {
      id: entry.id.toString(),
      date: entry.date,
      time: entry.time,
      productId: entry.productId?.toString() ?? null,
      customProductName: entry.customProductName ?? null,
      administrationMethod: entry.administrationMethod,
      doseAmount: entry.doseAmount,
      doseUnit: entry.doseUnit,
      notes: entry.notes ?? null,
      isFavorite: entry.isFavorite,
      symptoms: entry.symptoms.map((s: any) => ({
        id: s.id.toString(),
        symptomKey: s.symptomKey,
        customSymptomName: s.customSymptomName ?? null,
        severityBefore: s.severityBefore,
        severityAfter: s.severityAfter ?? null,
      })),
      effects: entry.effects.map((ef: any) => ({
        id: ef.id.toString(),
        effectKey: ef.effectKey,
        isPositive: ef.isPositive,
        customEffectName: ef.customEffectName ?? null,
      })),
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }
  }
}
