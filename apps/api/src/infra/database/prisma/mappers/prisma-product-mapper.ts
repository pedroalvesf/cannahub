import {
  Product as PrismaProduct,
  Prisma,
} from '@/generated/prisma/client';
import { Product } from '@/domain/association/enterprise/entities/product';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create(
      {
        associationId: new UniqueEntityID(raw.associationId),
        name: raw.name,
        description: raw.description ?? undefined,
        type: raw.type,
        category: raw.category,
        concentration: raw.concentration ?? undefined,
        cbd: raw.cbd,
        thc: raw.thc,
        dosagePerDrop: raw.dosagePerDrop ?? undefined,
        inStock: raw.inStock,
        imageUrl: raw.imageUrl ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    product: Product,
  ): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      associationId: product.associationId.toString(),
      name: product.name,
      description: product.description,
      type: product.type,
      category: product.category,
      concentration: product.concentration,
      cbd: product.cbd,
      thc: product.thc,
      dosagePerDrop: product.dosagePerDrop,
      inStock: product.inStock,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static toPrismaUpdate(
    product: Product,
  ): Prisma.ProductUncheckedUpdateInput {
    return {
      name: product.name,
      description: product.description,
      type: product.type,
      category: product.category,
      concentration: product.concentration,
      cbd: product.cbd,
      thc: product.thc,
      dosagePerDrop: product.dosagePerDrop,
      inStock: product.inStock,
      imageUrl: product.imageUrl,
      updatedAt: product.updatedAt,
    };
  }
}
