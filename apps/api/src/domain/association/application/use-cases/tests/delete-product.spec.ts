import { DeleteProductUseCase } from '../delete-product';
import { InMemoryProductsRepository } from '@/test/repositories/in-memory-products-repository';
import { makeProduct } from '@/test/factories/make-product';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ProductNotFoundError } from '../errors/product-not-found-error';
import { NotAuthorizedForAssociationError } from '../errors/not-authorized-for-association-error';

let productsRepository: InMemoryProductsRepository;
let sut: DeleteProductUseCase;

describe('DeleteProductUseCase', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new DeleteProductUseCase(productsRepository);
  });

  it('should delete a product', async () => {
    const associationId = new UniqueEntityID();
    const product = makeProduct({ associationId });
    productsRepository.items.push(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      associationId: associationId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(productsRepository.items).toHaveLength(0);
  });

  it('should fail if product not found', async () => {
    const result = await sut.execute({
      productId: 'non-existent',
      associationId: 'any',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProductNotFoundError);
  });

  it('should fail if product belongs to another association', async () => {
    const product = makeProduct({ associationId: new UniqueEntityID() });
    productsRepository.items.push(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      associationId: 'different',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAuthorizedForAssociationError);
  });
});
