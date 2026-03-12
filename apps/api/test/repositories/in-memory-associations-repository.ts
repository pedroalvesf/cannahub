import {
  AssociationsRepository,
  AssociationFilters,
} from '@/domain/association/application/repositories/associations-repository';
import { Association } from '@/domain/association/enterprise/entities/association';

export class InMemoryAssociationsRepository implements AssociationsRepository {
  public items: Association[] = [];

  async findById(id: string): Promise<Association | null> {
    const item = this.items.find((i) => i.id.toString() === id);
    return item ?? null;
  }

  async findByCnpj(cnpj: string): Promise<Association | null> {
    const item = this.items.find((i) => i.cnpj === cnpj);
    return item ?? null;
  }

  async findByRegion(region: string): Promise<Association[]> {
    return this.items.filter((i) => i.region === region);
  }

  async findByState(state: string): Promise<Association[]> {
    return this.items.filter((i) => i.state === state);
  }

  async findMany(filters?: AssociationFilters): Promise<Association[]> {
    let result = [...this.items];

    if (filters?.region) {
      result = result.filter((i) => i.region === filters.region);
    }
    if (filters?.state) {
      result = result.filter((i) => i.state === filters.state);
    }
    if (filters?.status) {
      result = result.filter((i) => i.status === filters.status);
    }
    if (filters?.hasAssistedAccess !== undefined) {
      result = result.filter(
        (i) => i.hasAssistedAccess === filters.hasAssistedAccess,
      );
    }

    return result;
  }

  async create(association: Association): Promise<void> {
    this.items.push(association);
  }

  async save(association: Association): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === association.id.toString(),
    );
    if (index >= 0) {
      this.items[index] = association;
    }
  }
}
