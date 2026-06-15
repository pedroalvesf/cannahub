import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CreateDiaryFavoriteUseCase } from '@/domain/diary/application/use-cases/create-diary-favorite'
import { CreateDiaryFavoriteDto } from '../dto/create-diary-favorite-dto'

@Controller('diary/favorites')
@UseGuards(JwtAuthGuard)
export class CreateDiaryFavoriteController {
  constructor(private createDiaryFavorite: CreateDiaryFavoriteUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateDiaryFavoriteDto,
  ) {
    const result = await this.createDiaryFavorite.execute({
      userId: user.sub,
      name: body.name,
      productId: body.productId,
      customProductName: body.customProductName,
      administrationMethod: body.administrationMethod,
      doseAmount: body.doseAmount,
      doseUnit: body.doseUnit,
      symptomKeys: body.symptomKeys,
    })

    const favorite = result.value as { favorite: any }
    return {
      id: favorite.favorite.id.toString(),
      name: favorite.favorite.name,
    }
  }
}
