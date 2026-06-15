import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetUserAssociationUseCase } from '@/domain/association/application/use-cases/get-user-association';
import { ListMemberDocumentsUseCase } from '@/domain/association/application/use-cases/list-member-documents';
import { LinkNotFoundError } from '@/domain/association/application/use-cases/errors/link-not-found-error';

@Controller('association/members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('association_documents', 'read')
export class AssociationListMemberDocumentsController {
  constructor(
    private getUserAssociation: GetUserAssociationUseCase,
    private listMemberDocuments: ListMemberDocumentsUseCase,
  ) {}

  @Get(':id/documents')
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload, @Param('id') linkId: string) {
    const assocResult = await this.getUserAssociation.execute({
      userId: user.sub,
    });
    if (assocResult.isLeft()) throw new ForbiddenException();

    const result = await this.listMemberDocuments.execute({
      associationId: assocResult.value.associationId,
      linkId,
    });

    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof LinkNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw new ForbiddenException(error.message);
    }

    return {
      patientName: result.value.patientName,
      documents: result.value.documents,
    };
  }
}
