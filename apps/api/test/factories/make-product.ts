import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Product,
  ProductProps,
} from '@/domain/association/enterprise/entities/product';

let productCounter = 0;

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  productCounter++;

  return Product.create(
    {
      associationId: new UniqueEntityID(),
      name: `Product ${productCounter}`,
      type: 'Óleo',
      category: 'Óleo CBD',
      concentration: '15mg/ml',
      ...override,
    },
    id,
  );
}
