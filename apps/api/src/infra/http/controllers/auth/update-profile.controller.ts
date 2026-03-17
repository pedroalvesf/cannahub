import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { UpdateProfileUseCase } from '@/domain/auth/application/use-cases/update-profile';
import { UserNotFoundError } from '@/domain/auth/application/use-cases/errors/user-not-found-error';
import { UpdateProfileDto } from '../dto/update-profile-dto';

@Controller('auth/profile')
@UseGuards(JwtAuthGuard)
export class UpdateProfileController {
  constructor(private updateProfile: UpdateProfileUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: UpdateProfileDto,
  ) {
    const result = await this.updateProfile.execute({
      userId: user.sub,
      name: body.name,
      phone: body.phone,
      cpf: body.cpf,
    });

    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }
    }

    const { user: updated } = result.value as {
      user: {
        id: { toString(): string };
        email: string;
        name?: string;
        phone?: string;
        cpf?: string;
        accountType?: string;
        accountStatus: string;
        verificationStatus: string;
      };
    };

    return {
      id: updated.id.toString(),
      email: updated.email,
      name: updated.name,
      phone: updated.phone,
      cpf: updated.cpf,
      accountType: updated.accountType,
      accountStatus: updated.accountStatus,
      verificationStatus: updated.verificationStatus,
    };
  }
}
