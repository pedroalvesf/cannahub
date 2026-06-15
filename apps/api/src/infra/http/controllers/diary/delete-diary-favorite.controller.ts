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
import { DeleteDiaryFavoriteUseCase } from '@/domain/diary/application/use-cases/delete-diary-favorite'
import { DiaryFavoriteNotFoundError } from '@/domain/diary/application/use-cases/errors/diary-favorite-not-found-error'
import { NotAllowedError } from '@/domain/diary/application/use-cases/errors/not-allowed-error'

@Controller('diary/favorites')
@UseGuards(JwtAuthGuard)
export class DeleteDiaryFavoriteController {
  constructor(private deleteDiaryFavorite: DeleteDiaryFavoriteUseCase) {}

  @Delete(':id')
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const result = await this.deleteDiaryFavorite.execute({
      favoriteId: id,
      userId: user.sub,
    })

    if (result.isLeft()) {
      if (result.value instanceof DiaryFavoriteNotFoundError) {
        throw new NotFoundException(result.value.message)
      }
      if (result.value instanceof NotAllowedError) {
        throw new ForbiddenException(result.value.message)
      }
    }

    return { success: true }
  }
}
