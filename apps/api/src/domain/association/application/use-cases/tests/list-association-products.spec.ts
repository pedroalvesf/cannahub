import { ListAssociationProductsUseCase } from '../list-association-products';
import { InMemoryProductsRepository } from '@/test/repositories/in-memory-products-repository';
import { InMemoryProductVariantsRepository } from '@/test/repositories/in-memory-product-variants-repository';
import { makeProduct } from '@/test/factories/make-product';
import { makeProductVariant } from '@/test/factories/make-product-variant';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let productsRepository: InMemoryProductsRepository;
let variantsRepository: InMemoryProductVariantsRepository;
let sut: ListAssociationProductsUseCase;

describe('ListAssociationProductsUseCase', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    variantsRepository = new InMemoryProductVariantsRepository();
    sut = new ListAssociationProductsUseCase(productsRepository, variantsRepository);
  });

  it('should list products with variants for an association', async () => {
    const associationId = new UniqueEntityID();

    const product = makeProduct({ associationId });
    productsRepository.items.push(product);

    const variant = makeProductVariant({ productId: product.id });
    variantsRepository.items.push(variant);

    const result = await sut.execute({ associationId: associationId.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.products).toHaveLength(1);
      expect(result.value.products[0]?.variants).toHaveLength(1);
    }
  });

  it('should return empty array when no products exist', async () => {
    const result = await sut.execute({ associationId: 'non-existent' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.products).toHaveLength(0);
    }
  });
});
