import { Association } from '@/domain/association/enterprise/entities/association';

export interface AssociationFilters {
  region?: string;
  state?: string;
  status?: string;
  hasAssistedAccess?: boolean;
}

export abstract class AssociationsRepository {
  abstract findById(id: string): Promise<Association | null>;
  abstract findByCnpj(cnpj: string): Promise<Association | null>;
  abstract findByRegion(region: string): Promise<Association[]>;
  abstract findByState(state: string): Promise<Association[]>;
  abstract findMany(filters?: AssociationFilters): Promise<Association[]>;
  abstract create(association: Association): Promise<void>;
  abstract save(association: Association): Promise<void>;
}
