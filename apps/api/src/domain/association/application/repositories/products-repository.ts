import { Product } from '@/domain/association/enterprise/entities/product';

export interface ProductFilters {
  associationId?: string;
  type?: string;
  category?: string;
  inStock?: boolean;
}

export abstract class ProductsRepository {
  abstract findById(id: string): Promise<Product | null>;
  abstract findByAssociationId(associationId: string): Promise<Product[]>;
  abstract findMany(filters?: ProductFilters): Promise<Product[]>;
  abstract create(product: Product): Promise<void>;
  abstract save(product: Product): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract countByAssociationId(associationId: string): Promise<number>;
}
