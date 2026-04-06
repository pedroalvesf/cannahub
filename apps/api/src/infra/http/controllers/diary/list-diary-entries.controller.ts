import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ListDiaryEntriesUseCase } from '@/domain/diary/application/use-cases/list-diary-entries'

@Controller('diary')
@UseGuards(JwtAuthGuard)
export class ListDiaryEntriesController {
  constructor(private listDiaryEntries: ListDiaryEntriesUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('productId') productId?: string,
    @Query('administrationMethod') administrationMethod?: string,
    @Query('symptomKey') symptomKey?: string,
  ) {
    const result = await this.listDiaryEntries.execute({
      userId: user.sub,
      page: page ? parseInt(page, 10) : undefined,
      perPage: perPage ? parseInt(perPage, 10) : undefined,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      productId,
      administrationMethod,
      symptomKey,
    })

    const { entries, total } = result.value as { entries: any[]; total: number }
    return {
      entries: entries.map((e) => ({
        id: e.id.toString(),
        date: e.date,
        time: e.time,
        productId: e.productId?.toString() ?? null,
        customProductName: e.customProductName ?? null,
        administrationMethod: e.administrationMethod,
        doseAmount: e.doseAmount,
        doseUnit: e.doseUnit,
        notes: e.notes ?? null,
        isFavorite: e.isFavorite,
        symptoms: e.symptoms.map((s: any) => ({
          id: s.id.toString(),
          symptomKey: s.symptomKey,
          customSymptomName: s.customSymptomName ?? null,
          severityBefore: s.severityBefore,
          severityAfter: s.severityAfter ?? null,
        })),
        effects: e.effects.map((ef: any) => ({
          id: ef.id.toString(),
          effectKey: ef.effectKey,
          isPositive: ef.isPositive,
          customEffectName: ef.customEffectName ?? null,
        })),
        createdAt: e.createdAt,
      })),
      total,
    }
  }
}
