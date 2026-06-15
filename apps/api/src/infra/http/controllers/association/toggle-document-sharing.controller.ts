import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ToggleDocumentSharingUseCase } from '@/domain/association/application/use-cases/toggle-document-sharing';
import { LinkNotFoundError } from '@/domain/association/application/use-cases/errors/link-not-found-error';
import { NotAuthorizedForAssociationError } from '@/domain/association/application/use-cases/errors/not-authorized-for-association-error';
import { ToggleDocumentSharingDto } from '../dto/toggle-document-sharing-dto';

@Controller('my-links')
@UseGuards(JwtAuthGuard)
export class ToggleDocumentSharingController {
  constructor(private toggleDocumentSharing: ToggleDocumentSharingUseCase) {}

  @Patch(':id/share-documents')
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') linkId: string,
    @Body() body: ToggleDocumentSharingDto,
  ) {
    const result = await this.toggleDocumentSharing.execute({
      userId: user.sub,
      linkId,
      share: body.share,
    });

    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof LinkNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotAuthorizedForAssociationError) {
        throw new ForbiddenException(error.message);
      }
      throw new BadRequestException(error.message);
    }

    return { documentsShared: result.value.documentsShared };
  }
}
