import { ProfessionalProfile } from '@/domain/patient/enterprise/entities/professional-profile';

export abstract class ProfessionalProfilesRepository {
  abstract findById(id: string): Promise<ProfessionalProfile | null>;
  abstract findByUserId(userId: string): Promise<ProfessionalProfile | null>;
  abstract findByRegistrationNumber(
    number: string,
    state: string,
  ): Promise<ProfessionalProfile | null>;
  abstract create(profile: ProfessionalProfile): Promise<void>;
  abstract save(profile: ProfessionalProfile): Promise<void>;
}
