import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { ProductsRepository } from '../repositories/products-repository';
import { ProductVariantsRepository } from '../repositories/product-variants-repository';
import { Product } from '../../enterprise/entities/product';
import { ProductVariant } from '../../enterprise/entities/product-variant';
import { ProductNotFoundError } from './errors/product-not-found-error';
import { NotAuthorizedForAssociationError } from './errors/not-authorized-for-association-error';

interface UpdateProductRequest {
  productId: string;
  associationId: string;
  name?: string;
  description?: string;
  type?: string;
  category?: string;
  concentration?: string;
  cbd?: number;
  thc?: number;
  dosagePerDrop?: string;
  inStock?: boolean;
  imageUrl?: string;
  variants?: Array<{ volume: string; price: number }>;
}

type UpdateProductResponse = Either<
  ProductNotFoundError | NotAuthorizedForAssociationError,
  { product: Product; variants: ProductVariant[] }
>;

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private productVariantsRepository: ProductVariantsRepository,
  ) {}

  async execute(
    request: UpdateProductRequest,
  ): Promise<UpdateProductResponse> {
    const product = await this.productsRepository.findById(request.productId);

    if (!product) {
      return left(new ProductNotFoundError(request.productId));
    }

    if (product.associationId.toString() !== request.associationId) {
      return left(new NotAuthorizedForAssociationError());
    }

    product.update({
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

    await this.productsRepository.save(product);

    let variants: ProductVariant[] = [];

    if (request.variants) {
      await this.productVariantsRepository.deleteByProductId(
        product.id.toString(),
      );

      variants = request.variants.map((v) =>
        ProductVariant.create({
          productId: product.id,
          volume: v.volume,
          price: v.price,
        }),
      );

      if (variants.length > 0) {
        await this.productVariantsRepository.createMany(variants);
      }
    } else {
      variants = await this.productVariantsRepository.findByProductId(
        product.id.toString(),
      );
    }

    return right({ product, variants });
  }
}
