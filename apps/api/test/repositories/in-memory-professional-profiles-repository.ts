import { ProfessionalProfilesRepository } from '@/domain/patient/application/repositories/professional-profiles-repository';
import { ProfessionalProfile } from '@/domain/patient/enterprise/entities/professional-profile';

export class InMemoryProfessionalProfilesRepository
  implements ProfessionalProfilesRepository
{
  public items: ProfessionalProfile[] = [];

  async findById(id: string): Promise<ProfessionalProfile | null> {
    const item = this.items.find((i) => i.id.toString() === id);
    return item ?? null;
  }

  async findByUserId(userId: string): Promise<ProfessionalProfile | null> {
    const item = this.items.find((i) => i.userId.toString() === userId);
    return item ?? null;
  }

  async findByRegistrationNumber(
    number: string,
    state: string,
  ): Promise<ProfessionalProfile | null> {
    const item = this.items.find(
      (i) =>
        i.registrationNumber === number && i.registrationState === state,
    );
    return item ?? null;
  }

  async create(profile: ProfessionalProfile): Promise<void> {
    this.items.push(profile);
  }

  async save(profile: ProfessionalProfile): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === profile.id.toString(),
    );
    if (index >= 0) {
      this.items[index] = profile;
    }
  }
}
