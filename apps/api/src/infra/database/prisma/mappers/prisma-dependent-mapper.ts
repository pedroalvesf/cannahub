import { Dependent as PrismaDependent, Prisma } from '@/generated/prisma/client';
import { Dependent } from '@/domain/patient/enterprise/entities/dependent';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaDependentMapper {
  static toDomain(raw: PrismaDependent): Dependent {
    return Dependent.create(
      {
        guardianUserId: new UniqueEntityID(raw.guardianUserId),
        name: raw.name,
        birthDate: raw.birthDate ?? undefined,
        documentNumber: raw.documentNumber ?? undefined,
        relationshipType: raw.relationshipType,
        proofDocumentId: raw.proofDocumentId
          ? new UniqueEntityID(raw.proofDocumentId)
          : undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(dependent: Dependent): Prisma.DependentUncheckedCreateInput {
    return {
      id: dependent.id.toString(),
      guardianUserId: dependent.guardianUserId.toString(),
      name: dependent.name,
      birthDate: dependent.birthDate,
      documentNumber: dependent.documentNumber,
      relationshipType: dependent.relationshipType,
      proofDocumentId: dependent.proofDocumentId?.toString(),
      createdAt: dependent.createdAt,
      updatedAt: dependent.updatedAt,
    };
  }

  static toPrismaUpdate(
    dependent: Dependent,
  ): Prisma.DependentUncheckedUpdateInput {
    return {
      name: dependent.name,
      birthDate: dependent.birthDate,
      documentNumber: dependent.documentNumber,
      relationshipType: dependent.relationshipType,
      proofDocumentId: dependent.proofDocumentId?.toString(),
      updatedAt: dependent.updatedAt,
    };
  }
}
