import {
  PatientAssociationLink as PrismaPatientAssociationLink,
  Prisma,
} from '@/generated/prisma/client';
import { PatientAssociationLink } from '@/domain/association/enterprise/entities/patient-association-link';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaPatientAssociationLinkMapper {
  static toDomain(raw: PrismaPatientAssociationLink): PatientAssociationLink {
    return PatientAssociationLink.create(
      {
        associationId: new UniqueEntityID(raw.associationId),
        patientId: new UniqueEntityID(raw.patientId),
        requestedByUserId: new UniqueEntityID(raw.requestedByUserId),
        status: raw.status,
        approvedByUserId: raw.approvedByUserId
          ? new UniqueEntityID(raw.approvedByUserId)
          : undefined,
        startDate: raw.startDate ?? undefined,
        endDate: raw.endDate ?? undefined,
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
      updatedAt: link.updatedAt,
    };
  }
}
