import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import {
  DoctorsRepository,
  ListDirectoryFilters,
} from '@/domain/onboarding/application/repositories/doctors-repository';
import { Doctor } from '@/domain/onboarding/enterprise/entities/doctor';
import { PrismaService } from '../prisma.service';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type DoctorRow = {
  id: string;
  slug: string;
  name: string;
  crm: string;
  state: string;
  city: string | null;
  specialties: string[];
  telemedicine: boolean;
  inPerson: boolean;
  bio: string | null;
  photoUrl: string | null;
  consultationFee: string | null;
  contactInfo: Prisma.JsonValue;
  active: boolean;
  directoryListed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function toDomain(r: DoctorRow): Doctor {
  return Doctor.create(
    {
      slug: r.slug,
      name: r.name,
      crm: r.crm,
      state: r.state,
      city: r.city ?? undefined,
      specialties: r.specialties,
      telemedicine: r.telemedicine,
      inPerson: r.inPerson,
      bio: r.bio ?? undefined,
      photoUrl: r.photoUrl ?? undefined,
      consultationFee: r.consultationFee ?? undefined,
      contactInfo: r.contactInfo as Record<string, unknown>,
      active: r.active,
      directoryListed: r.directoryListed,
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

  async findBySlug(slug: string): Promise<Doctor | null> {
    const raw = await this.prisma.doctor.findUnique({ where: { slug } });
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

  async listForDirectory(filters: ListDirectoryFilters): Promise<Doctor[]> {
    const where: Prisma.DoctorWhereInput = {
      active: true,
      directoryListed: true,
    };

    if (filters.state) {
      where.state = filters.state;
    }

    if (filters.specialty) {
      where.specialties = { has: filters.specialty };
    }

    if (filters.modality === 'telemedicine') {
      where.telemedicine = true;
    } else if (filters.modality === 'in_person') {
      where.inPerson = true;
    }

    const raw = await this.prisma.doctor.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return raw.map(toDomain);
  }

  async create(doctor: Doctor): Promise<void> {
    await this.prisma.doctor.create({
      data: {
        id: doctor.id.toString(),
        slug: doctor.slug,
        name: doctor.name,
        crm: doctor.crm,
        state: doctor.state,
        city: doctor.city ?? null,
        specialties: doctor.specialties,
        telemedicine: doctor.telemedicine,
        inPerson: doctor.inPerson,
        bio: doctor.bio ?? null,
        photoUrl: doctor.photoUrl ?? null,
        consultationFee: doctor.consultationFee ?? null,
        contactInfo:
          doctor.contactInfo as unknown as Prisma.InputJsonValue,
        active: doctor.active,
        directoryListed: doctor.directoryListed,
      },
    });
  }

  async save(doctor: Doctor): Promise<void> {
    await this.prisma.doctor.update({
      where: { id: doctor.id.toString() },
      data: {
        slug: doctor.slug,
        name: doctor.name,
        crm: doctor.crm,
        state: doctor.state,
        city: doctor.city ?? null,
        specialties: doctor.specialties,
        telemedicine: doctor.telemedicine,
        inPerson: doctor.inPerson,
        bio: doctor.bio ?? null,
        photoUrl: doctor.photoUrl ?? null,
        consultationFee: doctor.consultationFee ?? null,
        contactInfo:
          doctor.contactInfo as unknown as Prisma.InputJsonValue,
        active: doctor.active,
        directoryListed: doctor.directoryListed,
      },
    });
  }
}
