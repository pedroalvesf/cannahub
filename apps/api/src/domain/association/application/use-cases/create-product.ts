import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ProductsRepository } from '../repositories/products-repository';
import { ProductVariantsRepository } from '../repositories/product-variants-repository';
import { AssociationsRepository } from '../repositories/associations-repository';
import { Product } from '../../enterprise/entities/product';
import { ProductVariant } from '../../enterprise/entities/product-variant';
import { AssociationNotFoundError } from './errors/association-not-found-error';

interface CreateProductRequest {
  associationId: string;
  name: string;
  description?: string;
  type: string;
  category: string;
  concentration?: string;
  cbd?: number;
  thc?: number;
  dosagePerDrop?: string;
  inStock?: boolean;
  imageUrl?: string;
  variants: Array<{ volume: string; price: number }>;
}

type CreateProductResponse = Either<
  AssociationNotFoundError,
  { product: Product; variants: ProductVariant[] }
>;

@Injectable()
export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private productVariantsRepository: ProductVariantsRepository,
    private associationsRepository: AssociationsRepository,
  ) {}

  async execute(
    request: CreateProductRequest,
  ): Promise<CreateProductResponse> {
    const association = await this.associationsRepository.findById(
      request.associationId,
    );

    if (!association) {
      return left(new AssociationNotFoundError(request.associationId));
    }

    const product = Product.create({
      associationId: new UniqueEntityID(request.associationId),
      name: request.name,
      description: request.description,
      type: request.type,
      category: request.category,
      concentration: request.concentration,
      cbd: request.cbd,
      thc: request.thc,
      dosagePerDrop: request.dosagePerDrop,
      inStock: request.inStock,
      imageUrl: request.imageUrl,
    });

    await this.productsRepository.create(product);

    const variants = request.variants.map((v) =>
      ProductVariant.create({
        productId: product.id,
        volume: v.volume,
        price: v.price,
      }),
    );

    if (variants.length > 0) {
      await this.productVariantsRepository.createMany(variants);
    }

    return right({ product, variants });
  }
}
