import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ListDiaryFavoritesUseCase } from '@/domain/diary/application/use-cases/list-diary-favorites'

@Controller('diary/favorites')
@UseGuards(JwtAuthGuard)
export class ListDiaryFavoritesController {
  constructor(private listDiaryFavorites: ListDiaryFavoritesUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.listDiaryFavorites.execute({
      userId: user.sub,
    })

    const { favorites } = result.value as { favorites: any[] }
    return {
      favorites: favorites.map((f) => ({
        id: f.id.toString(),
        name: f.name,
        productId: f.productId?.toString() ?? null,
        customProductName: f.customProductName ?? null,
        administrationMethod: f.administrationMethod,
        doseAmount: f.doseAmount,
        doseUnit: f.doseUnit,
        symptomKeys: f.symptomKeys,
        createdAt: f.createdAt,
      })),
    }
  }
}
