import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface ProductProps {
  associationId: UniqueEntityID;
  name: string;
  description?: string;
  type: string;
  category: string;
  concentration?: string;
  cbd: number;
  thc: number;
  dosagePerDrop?: string;
  inStock: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Product extends AggregateRoot<ProductProps> {
  get associationId() {
    return this.props.associationId;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get type() {
    return this.props.type;
  }

  get category() {
    return this.props.category;
  }

  get concentration() {
    return this.props.concentration;
  }

  get cbd() {
    return this.props.cbd;
  }

  get thc() {
    return this.props.thc;
  }

  get dosagePerDrop() {
    return this.props.dosagePerDrop;
  }

  get inStock() {
    return this.props.inStock;
  }

  get imageUrl() {
    return this.props.imageUrl;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  update(
    fields: Partial<
      Pick<
        ProductProps,
        | 'name'
        | 'description'
        | 'type'
        | 'category'
        | 'concentration'
        | 'cbd'
        | 'thc'
        | 'dosagePerDrop'
        | 'inStock'
        | 'imageUrl'
      >
    >,
  ) {
    Object.assign(this.props, fields);
    this.touch();
  }

  updateStock(inStock: boolean) {
    this.props.inStock = inStock;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<ProductProps, 'createdAt' | 'updatedAt' | 'inStock' | 'cbd' | 'thc'>,
    id?: UniqueEntityID,
  ) {
    return new Product(
      {
        ...props,
        inStock: props.inStock ?? true,
        cbd: props.cbd ?? 0,
        thc: props.thc ?? 0,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
