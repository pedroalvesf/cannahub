import {
  ProductsRepository,
  ProductFilters,
} from '@/domain/association/application/repositories/products-repository';
import { Product } from '@/domain/association/enterprise/entities/product';

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null;
  }

  async findByAssociationId(associationId: string): Promise<Product[]> {
    return this.items.filter(
      (item) => item.associationId.toString() === associationId,
    );
  }

  async findMany(filters?: ProductFilters): Promise<Product[]> {
    let result = this.items;

    if (filters?.associationId) {
      result = result.filter(
        (item) => item.associationId.toString() === filters.associationId,
      );
    }
    if (filters?.type) {
      result = result.filter((item) => item.type === filters.type);
    }
    if (filters?.category) {
      result = result.filter((item) => item.category === filters.category);
    }
    if (filters?.inStock !== undefined) {
      result = result.filter((item) => item.inStock === filters.inStock);
    }

    return result;
  }

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }

  async save(product: Product): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.id.equals(product.id),
    );
    if (index >= 0) {
      this.items[index] = product;
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toString() !== id);
  }

  async countByAssociationId(associationId: string): Promise<number> {
    return this.items.filter(
      (item) => item.associationId.toString() === associationId,
    ).length;
  }
}
