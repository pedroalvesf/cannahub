import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { DoctorsRepository } from '@/domain/onboarding/application/repositories/doctors-repository';
import { Doctor } from '@/domain/onboarding/enterprise/entities/doctor';
import { PrismaService } from '../prisma.service';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

function toDomain(r: {
  id: string;
  name: string;
  crm: string;
  state: string;
  specialties: string[];
  telemedicine: boolean;
  consultationFee: string | null;
  contactInfo: Prisma.JsonValue;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Doctor {
  return Doctor.create(
    {
      name: r.name,
      crm: r.crm,
      state: r.state,
      specialties: r.specialties,
      telemedicine: r.telemedicine,
      consultationFee: r.consultationFee ?? undefined,
      contactInfo: r.contactInfo as Record<string, unknown>,
      active: r.active,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    },
    new UniqueEntityID(r.id),
  );
}

@Injectable()
export class PrismaDoctorsRepository implements DoctorsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Doctor | null> {
    const raw = await this.prisma.doctor.findUnique({ where: { id } });
    if (!raw) return null;
    return toDomain(raw);
  }

  async findByState(state: string): Promise<Doctor[]> {
    const raw = await this.prisma.doctor.findMany({
      where: { state, active: true },
    });
    return raw.map(toDomain);
  }

  async findByCrm(crm: string): Promise<Doctor | null> {
    const raw = await this.prisma.doctor.findUnique({ where: { crm } });
    if (!raw) return null;
    return toDomain(raw);
  }

  async create(doctor: Doctor): Promise<void> {
    await this.prisma.doctor.create({
      data: {
        id: doctor.id.toString(),
        name: doctor.name,
        crm: doctor.crm,
        state: doctor.state,
        specialties: doctor.specialties,
        telemedicine: doctor.telemedicine,
        consultationFee: doctor.consultationFee ?? null,
        contactInfo:
          doctor.contactInfo as unknown as Prisma.InputJsonValue,
        active: doctor.active,
      },
    });
  }

  async save(doctor: Doctor): Promise<void> {
    await this.prisma.doctor.update({
      where: { id: doctor.id.toString() },
      data: {
        name: doctor.name,
        crm: doctor.crm,
        state: doctor.state,
        specialties: doctor.specialties,
        telemedicine: doctor.telemedicine,
        consultationFee: doctor.consultationFee ?? null,
        contactInfo:
          doctor.contactInfo as unknown as Prisma.InputJsonValue,
        active: doctor.active,
      },
    });
  }
}
