import { Injectable } from '@nestjs/common';
import { DependentsRepository } from '@/domain/patient/application/repositories/dependents-repository';
import { Dependent } from '@/domain/patient/enterprise/entities/dependent';
import { PrismaService } from '../prisma.service';
import { PrismaDependentMapper } from '../mappers/prisma-dependent-mapper';

@Injectable()
export class PrismaDependentsRepository implements DependentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Dependent | null> {
    const dependent = await this.prisma.dependent.findUnique({
      where: { id },
    });
    return dependent ? PrismaDependentMapper.toDomain(dependent) : null;
  }

  async findByGuardianUserId(guardianUserId: string): Promise<Dependent[]> {
    const dependents = await this.prisma.dependent.findMany({
      where: { guardianUserId },
    });
    return dependents.map(PrismaDependentMapper.toDomain);
  }

  async create(dependent: Dependent): Promise<void> {
    const data = PrismaDependentMapper.toPrisma(dependent);
    await this.prisma.dependent.create({ data });
  }

  async save(dependent: Dependent): Promise<void> {
    const data = PrismaDependentMapper.toPrismaUpdate(dependent);
    await this.prisma.dependent.update({
      where: { id: dependent.id.toString() },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.dependent.delete({ where: { id } });
  }
}
