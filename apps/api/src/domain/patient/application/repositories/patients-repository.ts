import { Patient } from '@/domain/patient/enterprise/entities/patient';

export abstract class PatientsRepository {
  abstract findById(id: string): Promise<Patient | null>;
  abstract findByUserId(userId: string): Promise<Patient | null>;
  abstract findByDependentId(dependentId: string): Promise<Patient | null>;
  abstract create(patient: Patient): Promise<void>;
  abstract save(patient: Patient): Promise<void>;
}
