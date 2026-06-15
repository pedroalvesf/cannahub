import {
  PatientAssociationLink as PrismaPatientAssociationLink,
  Prisma,
} from '@/generated/prisma/client';
import {
  PatientAssociationLink,
  PatientAssociationStatusValue,
  FeeStatus,
} from '@/domain/association/enterprise/entities/patient-association-link';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaPatientAssociationLinkMapper {
  static toDomain(raw: PrismaPatientAssociationLink): PatientAssociationLink {
    return PatientAssociationLink.create(
      {
        associationId: new UniqueEntityID(raw.associationId),
        patientId: new UniqueEntityID(raw.patientId),
        requestedByUserId: new UniqueEntityID(raw.requestedByUserId),
        status: raw.status as PatientAssociationStatusValue,
        approvedByUserId: raw.approvedByUserId
          ? new UniqueEntityID(raw.approvedByUserId)
          : undefined,
        startDate: raw.startDate ?? undefined,
        endDate: raw.endDate ?? undefined,
        feeStatus: (raw.feeStatus ?? undefined) as FeeStatus | undefined,
        feeExpiresAt: raw.feeExpiresAt ?? undefined,
        feePaidAt: raw.feePaidAt ?? undefined,
        documentsShared: raw.documentsShared,
        documentsSharedAt: raw.documentsSharedAt ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    link: PatientAssociationLink,
  ): Prisma.PatientAssociationLinkUncheckedCreateInput {
    return {
      id: link.id.toString(),
      associationId: link.associationId.toString(),
      patientId: link.patientId.toString(),
      requestedByUserId: link.requestedByUserId.toString(),
      status: link.status,
      approvedByUserId: link.approvedByUserId?.toString(),
      startDate: link.startDate,
      endDate: link.endDate,
      feeStatus: link.feeStatus,
      feeExpiresAt: link.feeExpiresAt,
      feePaidAt: link.feePaidAt,
      documentsShared: link.documentsShared,
      documentsSharedAt: link.documentsSharedAt,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  }

  static toPrismaUpdate(
    link: PatientAssociationLink,
  ): Prisma.PatientAssociationLinkUncheckedUpdateInput {
    return {
      status: link.status,
      approvedByUserId: link.approvedByUserId?.toString(),
      startDate: link.startDate,
      endDate: link.endDate,
      feeStatus: link.feeStatus,
      feeExpiresAt: link.feeExpiresAt,
      feePaidAt: link.feePaidAt,
      documentsShared: link.documentsShared,
      documentsSharedAt: link.documentsSharedAt,
      updatedAt: link.updatedAt,
    };
  }
}
