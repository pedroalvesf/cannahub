import { Injectable } from '@nestjs/common';
import { ProfessionalProfilesRepository } from '@/domain/patient/application/repositories/professional-profiles-repository';
import { ProfessionalProfile } from '@/domain/patient/enterprise/entities/professional-profile';
import { PrismaService } from '../prisma.service';
import { PrismaProfessionalProfileMapper } from '../mappers/prisma-professional-profile-mapper';

@Injectable()
export class PrismaProfessionalProfilesRepository
  implements ProfessionalProfilesRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<ProfessionalProfile | null> {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { id },
    });
    return profile
      ? PrismaProfessionalProfileMapper.toDomain(profile)
      : null;
  }

  async findByUserId(userId: string): Promise<ProfessionalProfile | null> {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId },
    });
    return profile
      ? PrismaProfessionalProfileMapper.toDomain(profile)
      : null;
  }

  async findByRegistrationNumber(
    number: string,
    state: string,
  ): Promise<ProfessionalProfile | null> {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: {
        registrationNumber_registrationState: {
          registrationNumber: number,
          registrationState: state,
        },
      },
    });
    return profile
      ? PrismaProfessionalProfileMapper.toDomain(profile)
      : null;
  }

  async create(profile: ProfessionalProfile): Promise<void> {
    const data = PrismaProfessionalProfileMapper.toPrisma(profile);
    await this.prisma.professionalProfile.create({ data });
  }

  async save(profile: ProfessionalProfile): Promise<void> {
    const data = PrismaProfessionalProfileMapper.toPrismaUpdate(profile);
    await this.prisma.professionalProfile.update({
      where: { id: profile.id.toString() },
      data,
    });
  }
}
