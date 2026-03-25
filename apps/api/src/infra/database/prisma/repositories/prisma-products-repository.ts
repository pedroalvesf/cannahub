import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  ProductsRepository,
  ProductFilters,
} from '@/domain/association/application/repositories/products-repository';
import { Product } from '@/domain/association/enterprise/entities/product';
import { PrismaProductMapper } from '../mappers/prisma-product-mapper';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    return PrismaProductMapper.toDomain(product);
  }

  async findByAssociationId(associationId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { associationId },
      orderBy: { createdAt: 'desc' },
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async findMany(filters?: ProductFilters): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {};

    if (filters?.associationId) where.associationId = filters.associationId;
    if (filters?.type) where.type = filters.type;
    if (filters?.category) where.category = filters.category;
    if (filters?.inStock !== undefined) where.inStock = filters.inStock;

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);
    await this.prisma.product.create({ data });
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrismaUpdate(product);
    await this.prisma.product.update({
      where: { id: product.id.toString() },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async countByAssociationId(associationId: string): Promise<number> {
    return this.prisma.product.count({ where: { associationId } });
  }
}
