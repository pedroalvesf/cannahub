import { ProductVariant } from '@/domain/association/enterprise/entities/product-variant';

export abstract class ProductVariantsRepository {
  abstract findByProductId(productId: string): Promise<ProductVariant[]>;
  abstract createMany(variants: ProductVariant[]): Promise<void>;
  abstract deleteByProductId(productId: string): Promise<void>;
}
