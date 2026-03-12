import { DependentsRepository } from '@/domain/patient/application/repositories/dependents-repository';
import { Dependent } from '@/domain/patient/enterprise/entities/dependent';

export class InMemoryDependentsRepository implements DependentsRepository {
  public items: Dependent[] = [];

  async findById(id: string): Promise<Dependent | null> {
    const item = this.items.find((i) => i.id.toString() === id);
    return item ?? null;
  }

  async findByGuardianUserId(guardianUserId: string): Promise<Dependent[]> {
    return this.items.filter(
      (i) => i.guardianUserId.toString() === guardianUserId,
    );
  }

  async create(dependent: Dependent): Promise<void> {
    this.items.push(dependent);
  }

  async save(dependent: Dependent): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === dependent.id.toString(),
    );
    if (index >= 0) {
      this.items[index] = dependent;
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((i) => i.id.toString() === id);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
