import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { InMemoryRefreshTokenRepository } from '@/test/repositories/in-memory-refresh-token-repository';
import { FakeEncrypter } from '@/test/cryptography/fake-encrypter';
import { makeUser } from '@/test/factories/make-user';
import { makeRefreshToken } from '@/test/factories/make-refresh-token';
import { RefreshAccessTokenUseCase } from '../refresh-access-token';
import { RefreshTokenNotFoundError } from '../errors/refresh-token-not-found-error';
import { RefreshTokenExpiredError } from '../errors/refresh-token-expired-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let usersRepository: InMemoryUsersRepository;
let refreshTokenRepository: InMemoryRefreshTokenRepository;
let encrypter: FakeEncrypter;
let sut: RefreshAccessTokenUseCase;

describe('Refresh Access Token', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    refreshTokenRepository = new InMemoryRefreshTokenRepository();
    encrypter = new FakeEncrypter();
    sut = new RefreshAccessTokenUseCase(
      usersRepository,
      refreshTokenRepository,
      encrypter
    );
  });

  it('should be able to refresh access token with valid refresh token', async () => {
    const user = makeUser();
    const refreshToken = makeRefreshToken({
      userId: user.id,
      deviceId: new UniqueEntityID('device-1'),
    });

    await usersRepository.create(user);
    await refreshTokenRepository.create(refreshToken);

    const result = await sut.execute({
      refreshToken: refreshToken.token,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.accessToken).toEqual(expect.any(String));
      // Rotation: the returned refresh token must be a NEW one, not the old.
      expect(result.value.refreshToken).not.toBe(refreshToken.token);
      // FakeEncrypter returns JSON.stringify of the payload
      const payload = JSON.parse(result.value.accessToken);
      expect(payload).toHaveProperty('sub', user.id.toString());
      expect(payload).toHaveProperty('deviceId', 'device-1');
    }
  });

  it('should rotate the refresh token: revoke the old one and persist a new valid one', async () => {
    const user = makeUser();
    const refreshToken = makeRefreshToken({
      userId: user.id,
      deviceId: new UniqueEntityID('device-1'),
    });

    await usersRepository.create(user);
    await refreshTokenRepository.create(refreshToken);

    const result = await sut.execute({ refreshToken: refreshToken.token });

    expect(result.isRight()).toBe(true);

    // The old token is now revoked
    const oldToken = await refreshTokenRepository.findByToken(refreshToken.token);
    expect(oldToken?.isRevoked()).toBe(true);

    // A new, valid refresh token exists for the same device
    expect(refreshTokenRepository.items).toHaveLength(2);
    if (result.isRight()) {
      const newToken = await refreshTokenRepository.findByToken(
        result.value.refreshToken,
      );
      expect(newToken).not.toBeNull();
      expect(newToken?.isValid()).toBe(true);
      expect(newToken?.deviceId.toString()).toBe('device-1');
    }
  });

  it('should not be able to reuse a refresh token after it was rotated', async () => {
    const user = makeUser();
    const refreshToken = makeRefreshToken({ userId: user.id });

    await usersRepository.create(user);
    await refreshTokenRepository.create(refreshToken);

    // First refresh rotates the token
    await sut.execute({ refreshToken: refreshToken.token });

    // Reusing the original (now revoked) token must fail
    const reuse = await sut.execute({ refreshToken: refreshToken.token });
    expect(reuse.isLeft()).toBe(true);
    expect(reuse.value).toBeInstanceOf(RefreshTokenExpiredError);
  });

  it('should not be able to refresh access token with non-existent refresh token', async () => {
    const result = await sut.execute({
      refreshToken: 'non-existent-token',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RefreshTokenNotFoundError);
  });

  it('should not be able to refresh access token with expired refresh token', async () => {
    const user = makeUser();
    const expiredRefreshToken = makeRefreshToken({
      userId: user.id,
      expiresAt: new Date(Date.now() - 1000), // 1 second ago
    });

    await usersRepository.create(user);
    await refreshTokenRepository.create(expiredRefreshToken);

    const result = await sut.execute({
      refreshToken: expiredRefreshToken.token,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RefreshTokenExpiredError);
  });

  it('should not be able to refresh access token with revoked refresh token', async () => {
    const user = makeUser();
    const refreshToken = makeRefreshToken({
      userId: user.id,
      revoked: true,
      revokedAt: new Date(),
    });

    await usersRepository.create(user);
    await refreshTokenRepository.create(refreshToken);

    const result = await sut.execute({
      refreshToken: refreshToken.token,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RefreshTokenExpiredError);
  });

  it('should not be able to refresh access token when user does not exist', async () => {
    const refreshToken = makeRefreshToken({
      userId: new UniqueEntityID('non-existent-user'),
    });

    await refreshTokenRepository.create(refreshToken);

    const result = await sut.execute({
      refreshToken: refreshToken.token,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
