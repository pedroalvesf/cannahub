import { PatientAssociationLinksRepository } from '@/domain/association/application/repositories/patient-association-links-repository';
import { PatientAssociationLink } from '@/domain/association/enterprise/entities/patient-association-link';

export class InMemoryPatientAssociationLinksRepository
  implements PatientAssociationLinksRepository
{
  public items: PatientAssociationLink[] = [];

  async findById(id: string): Promise<PatientAssociationLink | null> {
    const item = this.items.find((i) => i.id.toString() === id);
    return item ?? null;
  }

  async findByPatientId(
    patientId: string,
  ): Promise<PatientAssociationLink[]> {
    return this.items.filter(
      (i) => i.patientId.toString() === patientId,
    );
  }

  async findByAssociationId(
    associationId: string,
  ): Promise<PatientAssociationLink[]> {
    return this.items.filter(
      (i) => i.associationId.toString() === associationId,
    );
  }

  async findByAssociationAndPatient(
    associationId: string,
    patientId: string,
  ): Promise<PatientAssociationLink | null> {
    const item = this.items.find(
      (i) =>
        i.associationId.toString() === associationId &&
        i.patientId.toString() === patientId,
    );
    return item ?? null;
  }

  async create(link: PatientAssociationLink): Promise<void> {
    this.items.push(link);
  }

  async save(link: PatientAssociationLink): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === link.id.toString(),
    );
    if (index >= 0) {
      this.items[index] = link;
    }
  }
}
