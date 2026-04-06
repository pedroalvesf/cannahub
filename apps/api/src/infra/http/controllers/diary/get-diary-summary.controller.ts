import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { GetDiarySummaryUseCase } from '@/domain/diary/application/use-cases/get-diary-summary'

@Controller('diary/summary')
@UseGuards(JwtAuthGuard)
export class GetDiarySummaryController {
  constructor(private getDiarySummary: GetDiarySummaryUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const result = await this.getDiarySummary.execute({
      userId: user.sub,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    })

    return result.value
  }
}
