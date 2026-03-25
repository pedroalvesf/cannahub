import { Controller, ConflictException, HttpCode, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { RequestAssociationLinkUseCase } from '@/domain/association/application/use-cases/request-association-link';
import { AssociationNotFoundError } from '@/domain/association/application/use-cases/errors/association-not-found-error';
import { DuplicateLinkError } from '@/domain/association/application/use-cases/errors/duplicate-link-error';

@Controller('associations')
@UseGuards(JwtAuthGuard)
export class RequestAssociationLinkController {
  constructor(private requestLink: RequestAssociationLinkUseCase) {}

  @Post(':id/link')
  @HttpCode(201)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.requestLink.execute({
      associationId: id,
      userId: user.sub,
    });

    if (result.isLeft()) {
      if (result.value instanceof AssociationNotFoundError) {
        throw new NotFoundException(result.value.message);
      }
      if (result.value instanceof DuplicateLinkError) {
        throw new ConflictException(result.value.message);
      }
    }

    if (result.isRight()) {
      return {
        link: {
          id: result.value.link.id.toString(),
          status: result.value.link.status,
        },
      };
    }
  }
}
