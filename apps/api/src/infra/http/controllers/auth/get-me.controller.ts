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
import { UserNotFoundError } from '@/domain/auth/application/use-cases/errors/user-not-found-error';

@Controller('auth/me')
@UseGuards(JwtAuthGuard)
export class GetMeController {
  constructor(
    private getUserById: GetUserByIdUseCase,
    private getAddress: GetAddressUseCase,
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

    const { user: userData } = result.value as {
      user: {
        id: { toString(): string };
        email: string;
        name?: string;
        accountType?: string;
        accountStatus: string;
        verificationStatus: string;
        phone?: string;
        cpf?: string;
      };
    };

    // Fetch address
    const addressResult = await this.getAddress.execute({
      userId: user.sub,
    });
    const address = addressResult.value.address;

    return {
      id: userData.id.toString(),
      email: userData.email,
      name: userData.name,
      accountType: userData.accountType,
      accountStatus: userData.accountStatus,
      verificationStatus: userData.verificationStatus,
      phone: userData.phone,
      cpf: userData.cpf,
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
