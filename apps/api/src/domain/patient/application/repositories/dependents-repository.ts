import { Dependent } from '@/domain/patient/enterprise/entities/dependent';

export abstract class DependentsRepository {
  abstract findById(id: string): Promise<Dependent | null>;
  abstract findByGuardianUserId(guardianUserId: string): Promise<Dependent[]>;
  abstract create(dependent: Dependent): Promise<void>;
  abstract save(dependent: Dependent): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
