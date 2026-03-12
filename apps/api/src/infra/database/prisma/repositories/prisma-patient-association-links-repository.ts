import { Injectable } from '@nestjs/common';
import { PatientAssociationLinksRepository } from '@/domain/association/application/repositories/patient-association-links-repository';
import { PatientAssociationLink } from '@/domain/association/enterprise/entities/patient-association-link';
import { PrismaService } from '../prisma.service';
import { PrismaPatientAssociationLinkMapper } from '../mappers/prisma-patient-association-link-mapper';

@Injectable()
export class PrismaPatientAssociationLinksRepository
  implements PatientAssociationLinksRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<PatientAssociationLink | null> {
    const link = await this.prisma.patientAssociationLink.findUnique({
      where: { id },
    });
    return link
      ? PrismaPatientAssociationLinkMapper.toDomain(link)
      : null;
  }

  async findByPatientId(
    patientId: string,
  ): Promise<PatientAssociationLink[]> {
    const links = await this.prisma.patientAssociationLink.findMany({
      where: { patientId },
    });
    return links.map(PrismaPatientAssociationLinkMapper.toDomain);
  }

  async findByAssociationId(
    associationId: string,
  ): Promise<PatientAssociationLink[]> {
    const links = await this.prisma.patientAssociationLink.findMany({
      where: { associationId },
    });
    return links.map(PrismaPatientAssociationLinkMapper.toDomain);
  }

  async findByAssociationAndPatient(
    associationId: string,
    patientId: string,
  ): Promise<PatientAssociationLink | null> {
    const link = await this.prisma.patientAssociationLink.findFirst({
      where: { associationId, patientId },
    });
    return link
      ? PrismaPatientAssociationLinkMapper.toDomain(link)
      : null;
  }

  async create(link: PatientAssociationLink): Promise<void> {
    const data = PrismaPatientAssociationLinkMapper.toPrisma(link);
    await this.prisma.patientAssociationLink.create({ data });
  }

  async save(link: PatientAssociationLink): Promise<void> {
    const data = PrismaPatientAssociationLinkMapper.toPrismaUpdate(link);
    await this.prisma.patientAssociationLink.update({
      where: { id: link.id.toString() },
      data,
    });
  }
}
