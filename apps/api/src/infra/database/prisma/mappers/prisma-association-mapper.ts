import {
  Association as PrismaAssociation,
  Prisma,
} from '@/generated/prisma/client';
import { Association } from '@/domain/association/enterprise/entities/association';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaAssociationMapper {
  static toDomain(raw: PrismaAssociation): Association {
    return Association.create(
      {
        name: raw.name,
        cnpj: raw.cnpj,
        status: raw.status,
        description: raw.description ?? undefined,
        region: raw.region,
        state: raw.state,
        city: raw.city,
        profileTypes: raw.profileTypes,
        hasAssistedAccess: raw.hasAssistedAccess,
        contactEmail: raw.contactEmail,
        contactPhone: raw.contactPhone ?? undefined,
        website: raw.website ?? undefined,
        logoUrl: raw.logoUrl ?? undefined,
        claimedAt: raw.claimedAt ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    association: Association,
  ): Prisma.AssociationCreateInput {
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
      claimedAt: association.claimedAt,
      createdAt: association.createdAt,
      updatedAt: association.updatedAt,
    };
  }

  static toPrismaUpdate(
    association: Association,
  ): Prisma.AssociationUpdateInput {
    return {
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
      claimedAt: association.claimedAt,
      updatedAt: association.updatedAt,
    };
  }
}
