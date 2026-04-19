import {
  DoctorsRepository,
  ListDirectoryFilters,
} from '@/domain/onboarding/application/repositories/doctors-repository';
import { Doctor } from '@/domain/onboarding/enterprise/entities/doctor';

export class InMemoryDoctorsRepository implements DoctorsRepository {
  public items: Doctor[] = [];

  async findById(id: string): Promise<Doctor | null> {
    return this.items.find((i) => i.id.toString() === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Doctor | null> {
    return this.items.find((i) => i.slug === slug) ?? null;
  }

  async findByState(state: string): Promise<Doctor[]> {
    return this.items.filter((i) => i.state === state && i.active);
  }

  async findByCrm(crm: string): Promise<Doctor | null> {
    return this.items.find((i) => i.crm === crm) ?? null;
  }

  async listForDirectory(filters: ListDirectoryFilters): Promise<Doctor[]> {
    let result = this.items.filter((i) => i.active && i.directoryListed);

    if (filters.state) {
      result = result.filter((i) => i.state === filters.state);
    }
    if (filters.specialty) {
      result = result.filter((i) => i.specialties.includes(filters.specialty!));
    }
    if (filters.modality === 'telemedicine') {
      result = result.filter((i) => i.telemedicine);
    } else if (filters.modality === 'in_person') {
      result = result.filter((i) => i.inPerson);
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  async create(doctor: Doctor): Promise<void> {
    this.items.push(doctor);
  }

  async save(doctor: Doctor): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === doctor.id.toString(),
    );
    if (index >= 0) {
      this.items[index] = doctor;
    }
  }
}
