import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CreateDependentUseCase } from '@/domain/patient/application/use-cases/create-dependent';
import { ListGuardianDependentsUseCase } from '@/domain/patient/application/use-cases/list-guardian-dependents';
import { CreateDependentDto } from '../dto/create-dependent-dto';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class CreateDependentController {
  constructor(
    private createDependent: CreateDependentUseCase,
    private listGuardianDependents: ListGuardianDependentsUseCase,
  ) {}

  @Post('dependent')
  async create(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateDependentDto,
  ) {
    const result = await this.createDependent.execute({
      guardianUserId: user.sub,
      name: body.name,
      birthDate: body.birthDate,
      documentNumber: body.documentNumber,
      relationshipType: body.relationshipType,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    const { dependent } = result.value;

    return {
      id: dependent.id.toString(),
      name: dependent.name,
      birthDate: dependent.birthDate,
      documentNumber: dependent.documentNumber,
      relationshipType: dependent.relationshipType,
    };
  }

  @Get('dependents')
  async list(@CurrentUser() user: UserPayload) {
    const result = await this.listGuardianDependents.execute({
      guardianUserId: user.sub,
    });

    return {
      dependents: result.value.dependents.map((dependent) => ({
        id: dependent.id.toString(),
        name: dependent.name,
        birthDate: dependent.birthDate,
        documentNumber: dependent.documentNumber,
        relationshipType: dependent.relationshipType,
      })),
    };
  }
}
