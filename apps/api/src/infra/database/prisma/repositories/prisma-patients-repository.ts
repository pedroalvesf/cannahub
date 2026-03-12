import { Injectable } from '@nestjs/common';
import { PatientsRepository } from '@/domain/patient/application/repositories/patients-repository';
import { Patient } from '@/domain/patient/enterprise/entities/patient';
import { PrismaService } from '../prisma.service';
import { PrismaPatientMapper } from '../mappers/prisma-patient-mapper';

@Injectable()
export class PrismaPatientsRepository implements PatientsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });
    return patient ? PrismaPatientMapper.toDomain(patient) : null;
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });
    return patient ? PrismaPatientMapper.toDomain(patient) : null;
  }

  async findByDependentId(dependentId: string): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: { dependentId },
    });
    return patient ? PrismaPatientMapper.toDomain(patient) : null;
  }

  async create(patient: Patient): Promise<void> {
    const data = PrismaPatientMapper.toPrisma(patient);
    await this.prisma.patient.create({ data });
  }

  async save(patient: Patient): Promise<void> {
    const data = PrismaPatientMapper.toPrismaUpdate(patient);
    await this.prisma.patient.update({
      where: { id: patient.id.toString() },
      data,
    });
  }
}
