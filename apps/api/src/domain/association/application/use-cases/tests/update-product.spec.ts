import { UpdateProductUseCase } from '../update-product';
import { InMemoryProductsRepository } from '@/test/repositories/in-memory-products-repository';
import { InMemoryProductVariantsRepository } from '@/test/repositories/in-memory-product-variants-repository';
import { makeProduct } from '@/test/factories/make-product';
import { makeProductVariant } from '@/test/factories/make-product-variant';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ProductNotFoundError } from '../errors/product-not-found-error';
import { NotAuthorizedForAssociationError } from '../errors/not-authorized-for-association-error';

let productsRepository: InMemoryProductsRepository;
let variantsRepository: InMemoryProductVariantsRepository;
let sut: UpdateProductUseCase;

describe('UpdateProductUseCase', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    variantsRepository = new InMemoryProductVariantsRepository();
    sut = new UpdateProductUseCase(productsRepository, variantsRepository);
  });

  it('should update product fields and replace variants', async () => {
    const associationId = new UniqueEntityID();
    const product = makeProduct({ associationId });
    productsRepository.items.push(product);

    const oldVariant = makeProductVariant({ productId: product.id });
    variantsRepository.items.push(oldVariant);

    const result = await sut.execute({
      productId: product.id.toString(),
      associationId: associationId.toString(),
      name: 'Updated Name',
      variants: [{ volume: '60ml', price: 300 }],
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.product.name).toBe('Updated Name');
      expect(result.value.variants).toHaveLength(1);
      expect(result.value.variants[0]?.volume).toBe('60ml');
    }
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
      associationId: 'different-association',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAuthorizedForAssociationError);
  });
});
