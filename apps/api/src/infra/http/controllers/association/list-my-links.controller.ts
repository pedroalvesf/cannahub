import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ListMyLinksUseCase } from '@/domain/association/application/use-cases/list-my-links';

@Controller('my-links')
@UseGuards(JwtAuthGuard)
export class ListMyLinksController {
  constructor(private listMyLinks: ListMyLinksUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.listMyLinks.execute({ userId: user.sub });

    return {
      links: result.value.links,
    };
  }
}
