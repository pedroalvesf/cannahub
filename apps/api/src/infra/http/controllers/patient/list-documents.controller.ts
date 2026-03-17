import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ListUserDocumentsUseCase } from '@/domain/patient/application/use-cases/list-user-documents';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class ListDocumentsController {
  constructor(private listUserDocuments: ListUserDocumentsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.listUserDocuments.execute({
      userId: user.sub,
    });

    const { documents } = result.value as {
      documents: Array<{
        id: { toString(): string };
        userId: { toString(): string };
        type: string;
        url: string;
        status: string;
        rejectionReason?: string;
        createdAt: Date;
        updatedAt?: Date;
      }>;
    };

    return {
      documents: documents.map((doc) => ({
        id: doc.id.toString(),
        type: doc.type,
        url: doc.url,
        status: doc.status,
        rejectionReason: doc.rejectionReason,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    };
  }
}
