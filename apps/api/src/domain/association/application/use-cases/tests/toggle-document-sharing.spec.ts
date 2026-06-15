import { ToggleDocumentSharingUseCase } from '../toggle-document-sharing';
import { InMemoryPatientAssociationLinksRepository } from '@/test/repositories/in-memory-patient-association-links-repository';
import { InMemoryPatientsRepository } from '@/test/repositories/in-memory-patients-repository';
import { makePatientAssociationLink } from '@/test/factories/make-patient-association-link';
import { makePatient } from '@/test/factories/make-patient';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { LinkNotFoundError } from '../errors/link-not-found-error';
import { NotAuthorizedForAssociationError } from '../errors/not-authorized-for-association-error';
import { LinkNotActiveError } from '../errors/link-not-active-error';

let linksRepository: InMemoryPatientAssociationLinksRepository;
let patientsRepository: InMemoryPatientsRepository;
let sut: ToggleDocumentSharingUseCase;

function setupActiveLink() {
  const userId = new UniqueEntityID();
  const patient = makePatient({ userId, type: 'self' });
  patientsRepository.items.push(patient);
  const link = makePatientAssociationLink({
    patientId: patient.id,
    status: 'active',
  });
  linksRepository.items.push(link);
  return { userId, patient, link };
}

describe('ToggleDocumentSharingUseCase', () => {
  beforeEach(() => {
    linksRepository = new InMemoryPatientAssociationLinksRepository();
    patientsRepository = new InMemoryPatientsRepository();
    sut = new ToggleDocumentSharingUseCase(linksRepository, patientsRepository);
  });

  it('should turn document sharing on', async () => {
    const { userId, link } = setupActiveLink();

    const result = await sut.execute({
      userId: userId.toString(),
      linkId: link.id.toString(),
      share: true,
    });

    expect(result.isRight()).toBe(true);
    expect(linksRepository.items[0]?.documentsShared).toBe(true);
    expect(linksRepository.items[0]?.documentsSharedAt).toBeInstanceOf(Date);
  });

  it('should turn document sharing off', async () => {
    const { userId, link } = setupActiveLink();
    link.shareDocuments();

    const result = await sut.execute({
      userId: userId.toString(),
      linkId: link.id.toString(),
      share: false,
    });

    expect(result.isRight()).toBe(true);
    expect(linksRepository.items[0]?.documentsShared).toBe(false);
  });

  it('should not allow toggling a link of another patient', async () => {
    const { link } = setupActiveLink();
    const otherUserId = new UniqueEntityID();
    patientsRepository.items.push(
      makePatient({ userId: otherUserId, type: 'self' }),
    );

    const result = await sut.execute({
      userId: otherUserId.toString(),
      linkId: link.id.toString(),
      share: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAuthorizedForAssociationError);
  });

  it('should fail when the link is not active', async () => {
    const userId = new UniqueEntityID();
    const patient = makePatient({ userId, type: 'self' });
    patientsRepository.items.push(patient);
    const link = makePatientAssociationLink({
      patientId: patient.id,
      status: 'requested',
    });
    linksRepository.items.push(link);

    const result = await sut.execute({
      userId: userId.toString(),
      linkId: link.id.toString(),
      share: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(LinkNotActiveError);
  });

  it('should fail when the link does not exist', async () => {
    const result = await sut.execute({
      userId: 'whatever',
      linkId: 'non-existent',
      share: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(LinkNotFoundError);
  });
});
