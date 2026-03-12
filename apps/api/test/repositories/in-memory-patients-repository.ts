import { PatientsRepository } from '@/domain/patient/application/repositories/patients-repository';
import { Patient } from '@/domain/patient/enterprise/entities/patient';

export class InMemoryPatientsRepository implements PatientsRepository {
  public items: Patient[] = [];

  async findById(id: string): Promise<Patient | null> {
    const item = this.items.find((i) => i.id.toString() === id);
    return item ?? null;
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    const item = this.items.find((i) => i.userId?.toString() === userId);
    return item ?? null;
  }

  async findByDependentId(dependentId: string): Promise<Patient | null> {
    const item = this.items.find(
      (i) => i.dependentId?.toString() === dependentId,
    );
    return item ?? null;
  }

  async create(patient: Patient): Promise<void> {
    this.items.push(patient);
  }

  async save(patient: Patient): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === patient.id.toString(),
    );
    if (index >= 0) {
      this.items[index] = patient;
    }
  }
}
