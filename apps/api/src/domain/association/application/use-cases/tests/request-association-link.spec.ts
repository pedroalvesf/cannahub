import { RequestAssociationLinkUseCase } from '../request-association-link';
import { InMemoryAssociationsRepository } from '@/test/repositories/in-memory-associations-repository';
import { InMemoryPatientAssociationLinksRepository } from '@/test/repositories/in-memory-patient-association-links-repository';
import { InMemoryPatientsRepository } from '@/test/repositories/in-memory-patients-repository';
import { makeAssociation } from '@/test/factories/make-association';
import { makePatientAssociationLink } from '@/test/factories/make-patient-association-link';
import { makePatient } from '@/test/factories/make-patient';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AssociationNotFoundError } from '../errors/association-not-found-error';
import { DuplicateLinkError } from '../errors/duplicate-link-error';

let associationsRepository: InMemoryAssociationsRepository;
let linksRepository: InMemoryPatientAssociationLinksRepository;
let patientsRepository: InMemoryPatientsRepository;
let sut: RequestAssociationLinkUseCase;

describe('RequestAssociationLinkUseCase', () => {
  beforeEach(() => {
    associationsRepository = new InMemoryAssociationsRepository();
    linksRepository = new InMemoryPatientAssociationLinksRepository();
    patientsRepository = new InMemoryPatientsRepository();
    sut = new RequestAssociationLinkUseCase(
      associationsRepository,
      linksRepository,
      patientsRepository,
    );
  });

  it('should create a link request', async () => {
    const association = makeAssociation();
    associationsRepository.items.push(association);

    const result = await sut.execute({
      associationId: association.id.toString(),
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.link.status).toBe('requested');
    }
    expect(linksRepository.items).toHaveLength(1);
  });

  it('should fail if association not found', async () => {
    const result = await sut.execute({
      associationId: 'non-existent',
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AssociationNotFoundError);
  });

  it('should fail if link already exists with active status', async () => {
    const association = makeAssociation();
    associationsRepository.items.push(association);

    const userId = new UniqueEntityID('user-1');

    // Create patient record so use case finds same patientId
    const patient = makePatient({ userId, type: 'self' });
    patientsRepository.items.push(patient);

    linksRepository.items.push(
      makePatientAssociationLink({
        associationId: association.id,
        patientId: patient.id,
        requestedByUserId: userId,
        status: 'active',
      }),
    );

    const result = await sut.execute({
      associationId: association.id.toString(),
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DuplicateLinkError);
  });
});
