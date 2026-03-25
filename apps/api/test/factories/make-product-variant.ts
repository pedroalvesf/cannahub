import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  ProductVariant,
  ProductVariantProps,
} from '@/domain/association/enterprise/entities/product-variant';

let variantCounter = 0;

export function makeProductVariant(
  override: Partial<ProductVariantProps> = {},
  id?: UniqueEntityID,
) {
  variantCounter++;

  return ProductVariant.create(
    {
      productId: new UniqueEntityID(),
      volume: '30ml',
      price: 150 + variantCounter * 10,
      ...override,
    },
    id,
  );
}
