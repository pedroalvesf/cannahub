import { Document as PrismaDocument, Prisma } from '@/generated/prisma/client';
import { Document } from '@/domain/patient/enterprise/entities/document';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaDocumentMapper {
  static toDomain(raw: PrismaDocument): Document {
    return Document.create(
      {
        userId: new UniqueEntityID(raw.userId),
        dependentId: raw.dependentId
          ? new UniqueEntityID(raw.dependentId)
          : undefined,
        type: raw.type,
        url: raw.url,
        status: raw.status,
        rejectionReason: raw.rejectionReason ?? undefined,
        reviewedBy: raw.reviewedBy
          ? new UniqueEntityID(raw.reviewedBy)
          : undefined,
        reviewedAt: raw.reviewedAt ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(document: Document): Prisma.DocumentUncheckedCreateInput {
    return {
      id: document.id.toString(),
      userId: document.userId.toString(),
      dependentId: document.dependentId?.toString(),
      type: document.type,
      url: document.url,
      status: document.status,
      rejectionReason: document.rejectionReason,
      reviewedBy: document.reviewedBy?.toString(),
      reviewedAt: document.reviewedAt,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  static toPrismaUpdate(
    document: Document,
  ): Prisma.DocumentUncheckedUpdateInput {
    return {
      status: document.status,
      rejectionReason: document.rejectionReason,
      reviewedBy: document.reviewedBy?.toString(),
      reviewedAt: document.reviewedAt,
      updatedAt: document.updatedAt,
    };
  }
}
