import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CreateEntryFromFavoriteUseCase } from '@/domain/diary/application/use-cases/create-entry-from-favorite'
import { LogFromFavoriteDto } from '../dto/log-from-favorite-dto'
import { DiaryFavoriteNotFoundError } from '@/domain/diary/application/use-cases/errors/diary-favorite-not-found-error'
import { NotAllowedError } from '@/domain/diary/application/use-cases/errors/not-allowed-error'

@Controller('diary/favorites')
@UseGuards(JwtAuthGuard)
export class LogFromFavoriteController {
  constructor(
    private createEntryFromFavorite: CreateEntryFromFavoriteUseCase,
  ) {}

  @Post(':id/log')
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() body: LogFromFavoriteDto,
  ) {
    const result = await this.createEntryFromFavorite.execute({
      favoriteId: id,
      userId: user.sub,
      date: new Date(body.date),
      time: body.time,
    })

    if (result.isLeft()) {
      if (result.value instanceof DiaryFavoriteNotFoundError) {
        throw new NotFoundException(result.value.message)
      }
      if (result.value instanceof NotAllowedError) {
        throw new ForbiddenException(result.value.message)
      }
    }

    const { entry } = result.value as { entry: any }
    return {
      id: entry.id.toString(),
      date: entry.date,
      time: entry.time,
    }
  }
}
