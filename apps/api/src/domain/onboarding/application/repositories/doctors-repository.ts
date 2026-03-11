import { Doctor } from '../../enterprise/entities/doctor';

export abstract class DoctorsRepository {
  abstract findById(id: string): Promise<Doctor | null>;
  abstract findByState(state: string): Promise<Doctor[]>;
  abstract findByCrm(crm: string): Promise<Doctor | null>;
  abstract create(doctor: Doctor): Promise<void>;
  abstract save(doctor: Doctor): Promise<void>;
}
