import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { ProductsRepository } from '../repositories/products-repository';
import { ProductNotFoundError } from './errors/product-not-found-error';
import { NotAuthorizedForAssociationError } from './errors/not-authorized-for-association-error';

interface DeleteProductRequest {
  productId: string;
  associationId: string;
}

type DeleteProductResponse = Either<
  ProductNotFoundError | NotAuthorizedForAssociationError,
  null
>;

@Injectable()
export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(
    request: DeleteProductRequest,
  ): Promise<DeleteProductResponse> {
    const product = await this.productsRepository.findById(request.productId);

    if (!product) {
      return left(new ProductNotFoundError(request.productId));
    }

    if (product.associationId.toString() !== request.associationId) {
      return left(new NotAuthorizedForAssociationError());
    }

    await this.productsRepository.delete(request.productId);

    return right(null);
  }
}
