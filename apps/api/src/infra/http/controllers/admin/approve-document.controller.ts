import {
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ApproveDocumentUseCase } from '@/domain/admin/application/use-cases/approve-document';
import { DocumentNotFoundError } from '@/domain/admin/application/use-cases/errors/document-not-found-error';

@Controller('admin/documents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('admin_documents', 'update')
export class AdminApproveDocumentController {
  constructor(private approveDocument: ApproveDocumentUseCase) {}

  @Patch(':id/approve')
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.approveDocument.execute({
      documentId: id,
      reviewerId: user.sub,
    });

    if (result.isLeft()) {
      if (result.value instanceof DocumentNotFoundError) {
        throw new NotFoundException(result.value.message);
      }
    }
  }
}
