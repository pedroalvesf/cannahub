import { Injectable } from '@nestjs/common';
import {
  AssociationsRepository,
  AssociationFilters,
} from '@/domain/association/application/repositories/associations-repository';
import { Association } from '@/domain/association/enterprise/entities/association';
import { PrismaService } from '../prisma.service';
import { PrismaAssociationMapper } from '../mappers/prisma-association-mapper';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class PrismaAssociationsRepository implements AssociationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Association | null> {
    const association = await this.prisma.association.findUnique({
      where: { id },
    });
    return association
      ? PrismaAssociationMapper.toDomain(association)
      : null;
  }

  async findByCnpj(cnpj: string): Promise<Association | null> {
    const association = await this.prisma.association.findUnique({
      where: { cnpj },
    });
    return association
      ? PrismaAssociationMapper.toDomain(association)
      : null;
  }

  async findByRegion(region: string): Promise<Association[]> {
    const associations = await this.prisma.association.findMany({
      where: { region },
    });
    return associations.map(PrismaAssociationMapper.toDomain);
  }

  async findByState(state: string): Promise<Association[]> {
    const associations = await this.prisma.association.findMany({
      where: { state },
    });
    return associations.map(PrismaAssociationMapper.toDomain);
  }

  async findMany(filters?: AssociationFilters): Promise<Association[]> {
    const where: Prisma.AssociationWhereInput = {};

    if (filters?.region) where.region = filters.region;
    if (filters?.state) where.state = filters.state;
    if (filters?.status) where.status = filters.status;
    if (filters?.hasAssistedAccess !== undefined)
      where.hasAssistedAccess = filters.hasAssistedAccess;

    const associations = await this.prisma.association.findMany({ where });
    return associations.map(PrismaAssociationMapper.toDomain);
  }

  async create(association: Association): Promise<void> {
    const data = PrismaAssociationMapper.toPrisma(association);
    await this.prisma.association.create({ data });
  }

  async save(association: Association): Promise<void> {
    const data = PrismaAssociationMapper.toPrismaUpdate(association);
    await this.prisma.association.update({
      where: { id: association.id.toString() },
      data,
    });
  }
}
