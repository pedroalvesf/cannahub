import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { SaveAddressUseCase } from '@/domain/auth/application/use-cases/save-address';
import { GetAddressUseCase } from '@/domain/auth/application/use-cases/get-address';
import { SaveAddressDto } from '../dto/save-address-dto';

@Controller('auth/address')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(
    private saveAddress: SaveAddressUseCase,
    private getAddress: GetAddressUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handleGet(@CurrentUser() user: UserPayload) {
    const result = await this.getAddress.execute({ userId: user.sub });
    const address = result.value.address;

    if (!address) {
      return { address: null };
    }

    return {
      address: {
        street: address.street,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      },
    };
  }

  @Put()
  @HttpCode(200)
  async handleSave(
    @CurrentUser() user: UserPayload,
    @Body() body: SaveAddressDto,
  ) {
    const result = await this.saveAddress.execute({
      userId: user.sub,
      ...body,
    });

    const address = result.value.address;

    return {
      address: {
        street: address.street,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      },
    };
  }
}
