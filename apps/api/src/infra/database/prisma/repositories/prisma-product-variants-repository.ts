import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductVariantsRepository } from '@/domain/association/application/repositories/product-variants-repository';
import { ProductVariant } from '@/domain/association/enterprise/entities/product-variant';
import { PrismaProductVariantMapper } from '../mappers/prisma-product-variant-mapper';

@Injectable()
export class PrismaProductVariantsRepository
  implements ProductVariantsRepository
{
  constructor(private prisma: PrismaService) {}

  async findByProductId(productId: string): Promise<ProductVariant[]> {
    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { price: 'asc' },
    });

    return variants.map(PrismaProductVariantMapper.toDomain);
  }

  async createMany(variants: ProductVariant[]): Promise<void> {
    if (variants.length === 0) return;

    const data = variants.map(PrismaProductVariantMapper.toPrisma);
    await this.prisma.productVariant.createMany({ data });
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.prisma.productVariant.deleteMany({
      where: { productId },
    });
  }
}
