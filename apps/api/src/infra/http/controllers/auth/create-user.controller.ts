import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Headers,
  HttpCode,
  Post,
} from '@nestjs/common';
import { CreateUserUseCase } from '@/domain/auth/application/use-cases/create-user';
import { CreateUserDto } from '../dto/create-user-dto';
import { UserAlreadyExistsError } from '@/domain/auth/application/use-cases/errors/user-already-exists-error';
import { CpfAlreadyInUseError } from '@/domain/auth/application/use-cases/errors/cpf-already-in-use-error';
import { AuthenticateDeviceUseCase } from '@/domain/auth/application/use-cases/authenticate-device';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Device } from '@/domain/auth/enterprise/entities/device';
import { Public } from '@/infra/auth/public';

@Controller('auth/user')
@Public()
export class CreateUserController {
  constructor(
    private createUser: CreateUserUseCase,
    private authenticateDevice: AuthenticateDeviceUseCase
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body() body: CreateUserDto,
    @Headers() headers: Record<string, string>
  ) {
    const ipAddress = headers['x-ipaddress'];
    const operatingSystem = headers['x-operatingsystem'];
    const browser = headers['x-browser'];
    const deviceType = headers['x-type'];

    if (!ipAddress || !operatingSystem || !browser || !deviceType) {
      throw new BadRequestException(
        'Required headers missing: x-ipaddress, x-operatingsystem, x-browser, x-type'
      );
    }

    const { email, password, name, accountType, phone, cpf } = body;
    const result = await this.createUser.execute({
      email,
      password,
      name,
      accountType,
      phone,
      cpf,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (
        error instanceof UserAlreadyExistsError ||
        error instanceof CpfAlreadyInUseError
      ) {
        throw new ConflictException(
          'Não foi possível criar a conta. Verifique os dados informados.',
        );
      }

      throw new BadRequestException('Erro ao criar usuário');
    }

    const deviceEntity = Device.create({
      userId: new UniqueEntityID(result.value.user.id.toString()),
      name: `${operatingSystem} - ${browser}`,
      type: deviceType,
      operatingSystem,
      ipAddress,
      browser,
      location: 'unknown',
      lastLogin: new Date(),
      createdAt: new Date(),
      active: true,
    });

    const tokens = await this.authenticateDevice.execute({
      password,
      device: deviceEntity,
    });

    if (tokens.isLeft()) {
      throw new BadRequestException(tokens.value.message);
    }

    const createdUser = result.value.user;

    return {
      accessToken: tokens.value.accessToken.token,
      refreshToken: tokens.value.refreshToken.token,
      user: {
        id: createdUser.id.toString(),
        email: createdUser.email,
        name: createdUser.name,
        accountType: createdUser.accountType,
        accountStatus: createdUser.accountStatus,
        verificationStatus: createdUser.verificationStatus,
        phone: createdUser.phone,
        cpf: createdUser.cpf ? `***.***.***-${createdUser.cpf.slice(-2)}` : null,
      },
    };
  }
}
