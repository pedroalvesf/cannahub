import {
  Body,
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
import { RejectDocumentUseCase } from '@/domain/admin/application/use-cases/reject-document';
import { DocumentNotFoundError } from '@/domain/admin/application/use-cases/errors/document-not-found-error';
import { RejectDocumentDto } from '../dto/reject-document-dto';

@Controller('admin/documents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('admin_documents', 'update')
export class AdminRejectDocumentController {
  constructor(private rejectDocument: RejectDocumentUseCase) {}

  @Patch(':id/reject')
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @Body() body: RejectDocumentDto,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.rejectDocument.execute({
      documentId: id,
      reviewerId: user.sub,
      reason: body.reason,
    });

    if (result.isLeft()) {
      if (result.value instanceof DocumentNotFoundError) {
        throw new NotFoundException(result.value.message);
      }
    }
  }
}
