import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { ListAssociationsUseCase } from '@/domain/association/application/use-cases/list-associations';

@Controller('associations')
@Public()
export class ListAssociationsController {
  constructor(private listAssociations: ListAssociationsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('region') region?: string,
    @Query('state') state?: string,
    @Query('hasAssistedAccess') hasAssistedAccess?: string,
  ) {
    const result = await this.listAssociations.execute({
      region,
      state,
      hasAssistedAccess:
        hasAssistedAccess === 'true'
          ? true
          : hasAssistedAccess === 'false'
            ? false
            : undefined,
    });

    const { associations } = result.value as {
      associations: Array<{
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
      }>;
    };

    return {
      associations: associations.map((a) => ({
        id: a.id.toString(),
        name: a.name,
        cnpj: a.cnpj,
        status: a.status,
        description: a.description,
        region: a.region,
        state: a.state,
        city: a.city,
        profileTypes: a.profileTypes,
        hasAssistedAccess: a.hasAssistedAccess,
        contactEmail: a.contactEmail,
        contactPhone: a.contactPhone,
        website: a.website,
        logoUrl: a.logoUrl,
      })),
    };
  }
}
