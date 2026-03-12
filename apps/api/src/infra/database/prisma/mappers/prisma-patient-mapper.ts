import { Patient as PrismaPatient, Prisma } from '@/generated/prisma/client';
import { Patient } from '@/domain/patient/enterprise/entities/patient';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaPatientMapper {
  static toDomain(raw: PrismaPatient): Patient {
    return Patient.create(
      {
        userId: raw.userId ? new UniqueEntityID(raw.userId) : undefined,
        dependentId: raw.dependentId
          ? new UniqueEntityID(raw.dependentId)
          : undefined,
        type: raw.type,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(patient: Patient): Prisma.PatientUncheckedCreateInput {
    return {
      id: patient.id.toString(),
      userId: patient.userId?.toString(),
      dependentId: patient.dependentId?.toString(),
      type: patient.type,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };
  }

  static toPrismaUpdate(
    patient: Patient,
  ): Prisma.PatientUncheckedUpdateInput {
    return {
      type: patient.type,
      updatedAt: patient.updatedAt,
    };
  }
}
