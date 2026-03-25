import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface ProductVariantProps {
  productId: UniqueEntityID;
  volume: string;
  price: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class ProductVariant extends Entity<ProductVariantProps> {
  get productId() {
    return this.props.productId;
  }

  get volume() {
    return this.props.volume;
  }

  get price() {
    return this.props.price;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<ProductVariantProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    return new ProductVariant(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
