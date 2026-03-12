import {
  ProfessionalProfile as PrismaProfessionalProfile,
  Prisma,
} from '@/generated/prisma/client';
import { ProfessionalProfile } from '@/domain/patient/enterprise/entities/professional-profile';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaProfessionalProfileMapper {
  static toDomain(raw: PrismaProfessionalProfile): ProfessionalProfile {
    return ProfessionalProfile.create(
      {
        userId: new UniqueEntityID(raw.userId),
        type: raw.type,
        registrationNumber: raw.registrationNumber,
        registrationState: raw.registrationState,
        specialty: raw.specialty ?? undefined,
        verifiedAt: raw.verifiedAt ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    profile: ProfessionalProfile,
  ): Prisma.ProfessionalProfileUncheckedCreateInput {
    return {
      id: profile.id.toString(),
      userId: profile.userId.toString(),
      type: profile.type,
      registrationNumber: profile.registrationNumber,
      registrationState: profile.registrationState,
      specialty: profile.specialty,
      verifiedAt: profile.verifiedAt,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  static toPrismaUpdate(
    profile: ProfessionalProfile,
  ): Prisma.ProfessionalProfileUncheckedUpdateInput {
    return {
      type: profile.type,
      registrationNumber: profile.registrationNumber,
      registrationState: profile.registrationState,
      specialty: profile.specialty,
      verifiedAt: profile.verifiedAt,
      updatedAt: profile.updatedAt,
    };
  }
}
