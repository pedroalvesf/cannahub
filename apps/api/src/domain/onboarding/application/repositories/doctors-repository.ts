import { Doctor } from '../../enterprise/entities/doctor';

export interface ListDirectoryFilters {
  state?: string;
  specialty?: string;
  modality?: 'telemedicine' | 'in_person';
}

export abstract class DoctorsRepository {
  abstract findById(id: string): Promise<Doctor | null>;
  abstract findBySlug(slug: string): Promise<Doctor | null>;
  abstract findByState(state: string): Promise<Doctor[]>;
  abstract findByCrm(crm: string): Promise<Doctor | null>;
  abstract listForDirectory(filters: ListDirectoryFilters): Promise<Doctor[]>;
  abstract create(doctor: Doctor): Promise<void>;
  abstract save(doctor: Doctor): Promise<void>;
}
