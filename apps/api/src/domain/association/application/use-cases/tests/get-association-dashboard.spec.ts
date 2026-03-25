import { GetAssociationDashboardUseCase } from '../get-association-dashboard';
import { InMemoryAssociationsRepository } from '@/test/repositories/in-memory-associations-repository';
import { InMemoryPatientAssociationLinksRepository } from '@/test/repositories/in-memory-patient-association-links-repository';
import { InMemoryProductsRepository } from '@/test/repositories/in-memory-products-repository';
import { makeAssociation } from '@/test/factories/make-association';
import { makePatientAssociationLink } from '@/test/factories/make-patient-association-link';
import { makeProduct } from '@/test/factories/make-product';

let associationsRepository: InMemoryAssociationsRepository;
let linksRepository: InMemoryPatientAssociationLinksRepository;
let productsRepository: InMemoryProductsRepository;
let sut: GetAssociationDashboardUseCase;

describe('GetAssociationDashboardUseCase', () => {
  beforeEach(() => {
    associationsRepository = new InMemoryAssociationsRepository();
    linksRepository = new InMemoryPatientAssociationLinksRepository();
    productsRepository = new InMemoryProductsRepository();
    sut = new GetAssociationDashboardUseCase(
      associationsRepository,
      linksRepository,
      productsRepository,
    );
  });

  it('should return dashboard stats', async () => {
    const association = makeAssociation({ name: 'Test' });
    associationsRepository.items.push(association);

    const assocId = association.id;

    linksRepository.items.push(
      makePatientAssociationLink({ associationId: assocId, status: 'active' }),
      makePatientAssociationLink({ associationId: assocId, status: 'active' }),
      makePatientAssociationLink({ associationId: assocId, status: 'requested' }),
    );

    productsRepository.items.push(
      makeProduct({ associationId: assocId }),
      makeProduct({ associationId: assocId }),
    );

    const result = await sut.execute({ associationId: assocId.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.associationName).toBe('Test');
      expect(result.value.membersCount).toBe(2);
      expect(result.value.pendingLinksCount).toBe(1);
      expect(result.value.productsCount).toBe(2);
    }
  });
});
