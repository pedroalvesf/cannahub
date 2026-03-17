import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import {
  GetAssociationByIdUseCase,
  AssociationNotFoundError,
} from '@/domain/association/application/use-cases/get-association-by-id';

@Controller('associations')
@Public()
export class GetAssociationController {
  constructor(private getAssociationById: GetAssociationByIdUseCase) {}

  @Get(':id')
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const result = await this.getAssociationById.execute({
      associationId: id,
    });

    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof AssociationNotFoundError) {
        throw new NotFoundException(error.message);
      }
    }

    const { association } = result.value as {
      association: {
        id: { toString(): string };
        name: string;
        cnpj?: string;
        status: string;
        description?: string;
        region?: string;
        state?: string;
        city?: string;
        profileTypes: string[];
        hasAssistedAccess: boolean;
        contactEmail?: string;
        contactPhone?: string;
        website?: string;
        logoUrl?: string;
      };
    };

    return {
      id: association.id.toString(),
      name: association.name,
      cnpj: association.cnpj,
      status: association.status,
      description: association.description,
      region: association.region,
      state: association.state,
      city: association.city,
      profileTypes: association.profileTypes,
      hasAssistedAccess: association.hasAssistedAccess,
      contactEmail: association.contactEmail,
      contactPhone: association.contactPhone,
      website: association.website,
      logoUrl: association.logoUrl,
    };
  }
}
