import { ProductVariantsRepository } from '@/domain/association/application/repositories/product-variants-repository';
import { ProductVariant } from '@/domain/association/enterprise/entities/product-variant';

export class InMemoryProductVariantsRepository
  implements ProductVariantsRepository
{
  public items: ProductVariant[] = [];

  async findByProductId(productId: string): Promise<ProductVariant[]> {
    return this.items.filter(
      (item) => item.productId.toString() === productId,
    );
  }

  async createMany(variants: ProductVariant[]): Promise<void> {
    this.items.push(...variants);
  }

  async deleteByProductId(productId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.productId.toString() !== productId,
    );
  }
}
