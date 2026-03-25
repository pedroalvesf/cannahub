import { CreateProductUseCase } from '../create-product';
import { InMemoryProductsRepository } from '@/test/repositories/in-memory-products-repository';
import { InMemoryProductVariantsRepository } from '@/test/repositories/in-memory-product-variants-repository';
import { InMemoryAssociationsRepository } from '@/test/repositories/in-memory-associations-repository';
import { makeAssociation } from '@/test/factories/make-association';
import { AssociationNotFoundError } from '../errors/association-not-found-error';

let productsRepository: InMemoryProductsRepository;
let variantsRepository: InMemoryProductVariantsRepository;
let associationsRepository: InMemoryAssociationsRepository;
let sut: CreateProductUseCase;

describe('CreateProductUseCase', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    variantsRepository = new InMemoryProductVariantsRepository();
    associationsRepository = new InMemoryAssociationsRepository();
    sut = new CreateProductUseCase(productsRepository, variantsRepository, associationsRepository);
  });

  it('should create a product with variants', async () => {
    const association = makeAssociation();
    associationsRepository.items.push(association);

    const result = await sut.execute({
      associationId: association.id.toString(),
      name: 'Óleo CBD 15mg/ml',
      type: 'Óleo',
      category: 'Óleo CBD',
      concentration: '15mg/ml',
      cbd: 15,
      thc: 0,
      variants: [
        { volume: '30ml', price: 150 },
        { volume: '10ml', price: 80 },
      ],
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.product.name).toBe('Óleo CBD 15mg/ml');
      expect(result.value.variants).toHaveLength(2);
    }
    expect(productsRepository.items).toHaveLength(1);
    expect(variantsRepository.items).toHaveLength(2);
  });

  it('should fail if association does not exist', async () => {
    const result = await sut.execute({
      associationId: 'non-existent',
      name: 'Test',
      type: 'Óleo',
      category: 'Óleo CBD',
      variants: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AssociationNotFoundError);
  });
});
