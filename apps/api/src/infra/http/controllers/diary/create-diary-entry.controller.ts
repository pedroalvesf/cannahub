import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CreateDiaryEntryUseCase } from '@/domain/diary/application/use-cases/create-diary-entry'
import { CreateDiaryEntryDto } from '../dto/create-diary-entry-dto'

@Controller('diary')
@UseGuards(JwtAuthGuard)
export class CreateDiaryEntryController {
  constructor(private createDiaryEntry: CreateDiaryEntryUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateDiaryEntryDto,
  ) {
    const result = await this.createDiaryEntry.execute({
      userId: user.sub,
      date: new Date(body.date),
      time: body.time,
      productId: body.productId,
      customProductName: body.customProductName,
      administrationMethod: body.administrationMethod,
      doseAmount: body.doseAmount,
      doseUnit: body.doseUnit,
      notes: body.notes,
      symptoms: body.symptoms,
      effects: body.effects,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }

    const entry = result.value.entry
    return {
      id: entry.id.toString(),
      date: entry.date,
      time: entry.time,
      administrationMethod: entry.administrationMethod,
      doseAmount: entry.doseAmount,
      doseUnit: entry.doseUnit,
    }
  }
}
