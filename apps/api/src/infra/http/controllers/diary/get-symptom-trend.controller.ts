import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { GetSymptomTrendUseCase } from '@/domain/diary/application/use-cases/get-symptom-trend'

@Controller('diary/symptoms')
@UseGuards(JwtAuthGuard)
export class GetSymptomTrendController {
  constructor(private getSymptomTrend: GetSymptomTrendUseCase) {}

  @Get(':key/trend')
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('key') key: string,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ) {
    const result = await this.getSymptomTrend.execute({
      userId: user.sub,
      symptomKey: key,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
    })

    return result.value
  }
}
