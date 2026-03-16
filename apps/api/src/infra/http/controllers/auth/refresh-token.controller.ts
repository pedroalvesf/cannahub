import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { RefreshAccessTokenUseCase } from '@/domain/auth/application/use-cases/refresh-access-token';
import { RefreshAccessTokenDto } from '../dto/refresh-access-token-dto';
import { InvalidTokenError } from '@/domain/auth/application/use-cases/errors/invalid-token-error';
import { RefreshTokenExpiredError } from '@/domain/auth/application/use-cases/errors/refresh-token-expired-error';
import { RefreshTokenNotFoundError } from '@/domain/auth/application/use-cases/errors/refresh-token-not-found-error';

@Controller('auth/refresh')
@Public()
export class RefreshTokenController {
  constructor(private refreshAccessToken: RefreshAccessTokenUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(@Body() body: RefreshAccessTokenDto) {
    const result = await this.refreshAccessToken.execute({
      refreshToken: body.refreshToken,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (
        error instanceof InvalidTokenError ||
        error instanceof RefreshTokenExpiredError ||
        error instanceof RefreshTokenNotFoundError
      ) {
        throw new UnauthorizedException(error.message);
      }

      throw new BadRequestException(error.message);
    }

    return {
      accessToken: result.value.accessToken,
      refreshToken: result.value.refreshToken,
    };
  }
}
