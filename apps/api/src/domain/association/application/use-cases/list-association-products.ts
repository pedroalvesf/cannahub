import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { ProductsRepository } from '../repositories/products-repository';
import { Product } from '../../enterprise/entities/product';
import { ProductVariantsRepository } from '../repositories/product-variants-repository';
import { ProductVariant } from '../../enterprise/entities/product-variant';

interface ListAssociationProductsRequest {
  associationId: string;
}

type ListAssociationProductsResponse = Either<
  never,
  { products: Array<{ product: Product; variants: ProductVariant[] }> }
>;

@Injectable()
export class ListAssociationProductsUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private productVariantsRepository: ProductVariantsRepository,
  ) {}

  async execute(
    request: ListAssociationProductsRequest,
  ): Promise<ListAssociationProductsResponse> {
    const products = await this.productsRepository.findByAssociationId(
      request.associationId,
    );

    const result = await Promise.all(
      products.map(async (product) => {
        const variants =
          await this.productVariantsRepository.findByProductId(
            product.id.toString(),
          );
        return { product, variants };
      }),
    );

    return right({ products: result });
  }
}
