import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';
import { RefreshTokenRepository } from '@/domain/auth/application/repositories/refresh-token-repository';
import { AccessToken } from '@/domain/auth/enterprise/entities/access-token';
import { RefreshToken } from '@/domain/auth/enterprise/entities/refresh-token';
import { Encrypter } from '../cryptography/encrypter';
import { InvalidTokenError } from '@/domain/auth/application/use-cases/errors/invalid-token-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { RefreshTokenExpiredError } from './errors/refresh-token-expired-error';
import { UserNotFoundError } from './errors/user-not-found-error';
import { RefreshTokenNotFoundError } from './errors/refresh-token-not-found-error';

interface RefreshAccessTokenUseCaseRequest {
  refreshToken: string;
}

type RefreshAccessTokenUseCaseResponse = Either<
  | InvalidTokenError
  | UserNotFoundError
  | RefreshTokenExpiredError
  | RefreshTokenNotFoundError,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    private userRepository: UsersRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    refreshToken,
  }: RefreshAccessTokenUseCaseRequest): Promise<RefreshAccessTokenUseCaseResponse> {
    const refreshTokenEntity = await this.refreshTokenRepository.findByToken(
      refreshToken
    );

    if (!refreshTokenEntity) {
      return left(new RefreshTokenNotFoundError());
    }

    if (!refreshTokenEntity.isValid()) {
      return left(new RefreshTokenExpiredError());
    }

    const user = await this.userRepository.findById(
      refreshTokenEntity.userId.toString()
    );

    if (!user) {
      return left(new UserNotFoundError(refreshTokenEntity.userId.toString()));
    }

    // Mint a fresh access + refresh token pair. The unique `jti` guarantees the
    // rotated refresh token string differs from the previous one (token is @unique).
    const { accessToken, refreshToken: newRefreshTokenValue } =
      await this.encrypter.encrypt({
        sub: refreshTokenEntity.userId.toString(),
        deviceId: refreshTokenEntity.deviceId.toString(),
        jti: new UniqueEntityID().toString(),
      });

    const newAccessTokenEntity = AccessToken.create({
      userId: new UniqueEntityID(user.id.toString()),
      token: accessToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour — aligned with JwtEncrypter
      createdAt: new Date(),
      revoked: false,
    });

    // Rotation: revoke the presented refresh token so it can no longer be used,
    // then persist a brand-new refresh token for the same device.
    refreshTokenEntity.revoke();
    await this.refreshTokenRepository.save(refreshTokenEntity);

    const newRefreshTokenEntity = RefreshToken.create({
      userId: refreshTokenEntity.userId,
      deviceId: refreshTokenEntity.deviceId,
      token: newRefreshTokenValue,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
      revoked: false,
    });
    await this.refreshTokenRepository.create(newRefreshTokenEntity);

    return right({
      accessToken: newAccessTokenEntity.token,
      refreshToken: newRefreshTokenEntity.token,
    });
  }
}
