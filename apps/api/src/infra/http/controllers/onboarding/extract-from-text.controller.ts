import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ExtractFromTextUseCase } from '@/domain/onboarding/application/use-cases/extract-from-text';
import { ExtractTextDto } from '../dto/extract-text-dto';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class ExtractFromTextController {
  constructor(private extractFromText: ExtractFromTextUseCase) {}

  @Post('extract')
  async handle(@Body() body: ExtractTextDto) {
    const result = await this.extractFromText.execute({
      input: body.input,
    });

    if (result.isRight()) {
      return { fields: result.value.fields };
    }
  }
}
