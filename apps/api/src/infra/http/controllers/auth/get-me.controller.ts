import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetUserByIdUseCase } from '@/domain/auth/application/use-cases/get-user-by-id';
import { GetAddressUseCase } from '@/domain/auth/application/use-cases/get-address';
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';
import { UserNotFoundError } from '@/domain/auth/application/use-cases/errors/user-not-found-error';

@Controller('auth/me')
@UseGuards(JwtAuthGuard)
export class GetMeController {
  constructor(
    private getUserById: GetUserByIdUseCase,
    private getAddress: GetAddressUseCase,
    private usersRepository: UsersRepository,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.getUserById.execute({ userId: user.sub });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }
    }

    if (result.isLeft()) return; // unreachable — satisfies TS narrowing

    const { user: userData } = result.value;

    // Fetch address and roles in parallel
    const [addressResult, userRoles] = await Promise.all([
      this.getAddress.execute({ userId: user.sub }),
      this.usersRepository.findRolesByUserId(user.sub),
    ]);
    const address = addressResult.value.address;

    return {
      id: userData.id.toString(),
      email: userData.email,
      name: userData.name,
      accountType: userData.accountType,
      accountStatus: userData.accountStatus,
      onboardingStatus: userData.onboardingStatus,
      documentsStatus: userData.documentsStatus,
      verificationStatus: userData.verificationStatus,
      phone: userData.phone,
      cpf: userData.cpf,
      roles: userRoles.map((r) => r.slug),
      address: address
        ? {
            street: address.street,
            complement: address.complement,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
          }
        : null,
    };
  }
}
