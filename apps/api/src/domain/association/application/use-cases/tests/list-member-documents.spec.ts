import { ListMemberDocumentsUseCase } from '../list-member-documents';
import { InMemoryPatientAssociationLinksRepository } from '@/test/repositories/in-memory-patient-association-links-repository';
import { InMemoryPatientsRepository } from '@/test/repositories/in-memory-patients-repository';
import { InMemoryDocumentsRepository } from '@/test/repositories/in-memory-documents-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { makePatientAssociationLink } from '@/test/factories/make-patient-association-link';
import { makePatient } from '@/test/factories/make-patient';
import { makeDocument } from '@/test/factories/make-document';
import { makeUser } from '@/test/factories/make-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAuthorizedForAssociationError } from '../errors/not-authorized-for-association-error';
import { DocumentsNotSharedError } from '../errors/documents-not-shared-error';

let linksRepository: InMemoryPatientAssociationLinksRepository;
let patientsRepository: InMemoryPatientsRepository;
let documentsRepository: InMemoryDocumentsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: ListMemberDocumentsUseCase;

function setup(opts: { status?: string; documentsShared?: boolean } = {}) {
  const associationId = new UniqueEntityID();
  const userId = new UniqueEntityID();

  const user = makeUser({ name: 'Maria Paciente' }, userId);
  usersRepository.items.push(user);

  const patient = makePatient({ userId, type: 'self' });
  patientsRepository.items.push(patient);

  documentsRepository.items.push(
    makeDocument({ userId, type: 'prescription' }),
    makeDocument({ userId, type: 'identity' }),
  );

  const link = makePatientAssociationLink({
    associationId,
    patientId: patient.id,
    status: (opts.status ?? 'active') as 'active',
    documentsShared: opts.documentsShared ?? true,
  });
  linksRepository.items.push(link);

  return { associationId, userId, link };
}

describe('ListMemberDocumentsUseCase', () => {
  beforeEach(() => {
    linksRepository = new InMemoryPatientAssociationLinksRepository();
    patientsRepository = new InMemoryPatientsRepository();
    documentsRepository = new InMemoryDocumentsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new ListMemberDocumentsUseCase(
      linksRepository,
      patientsRepository,
      documentsRepository,
      usersRepository,
    );
  });

  it('should return the shared documents with the patient name', async () => {
    const { associationId, link } = setup();

    const result = await sut.execute({
      associationId: associationId.toString(),
      linkId: link.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.patientName).toBe('Maria Paciente');
      expect(result.value.documents).toHaveLength(2);
    }
  });

  it('should fail when documents are not shared', async () => {
    const { associationId, link } = setup({ documentsShared: false });

    const result = await sut.execute({
      associationId: associationId.toString(),
      linkId: link.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DocumentsNotSharedError);
  });

  it('should fail when the link is not active', async () => {
    const { associationId, link } = setup({ status: 'cancelled' });

    const result = await sut.execute({
      associationId: associationId.toString(),
      linkId: link.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DocumentsNotSharedError);
  });

  it('should fail when the association does not own the link', async () => {
    const { link } = setup();

    const result = await sut.execute({
      associationId: 'another-association',
      linkId: link.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAuthorizedForAssociationError);
  });
});
