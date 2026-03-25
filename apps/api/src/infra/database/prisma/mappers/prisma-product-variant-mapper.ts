import {
  ProductVariant as PrismaProductVariant,
  Prisma,
} from '@/generated/prisma/client';
import { ProductVariant } from '@/domain/association/enterprise/entities/product-variant';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaProductVariantMapper {
  static toDomain(raw: PrismaProductVariant): ProductVariant {
    return ProductVariant.create(
      {
        productId: new UniqueEntityID(raw.productId),
        volume: raw.volume,
        price: Number(raw.price),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    variant: ProductVariant,
  ): Prisma.ProductVariantUncheckedCreateInput {
    return {
      id: variant.id.toString(),
      productId: variant.productId.toString(),
      volume: variant.volume,
      price: variant.price,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };
  }
}
