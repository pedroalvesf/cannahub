import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  ProfessionalProfile,
  ProfessionalProfileProps,
} from '@/domain/patient/enterprise/entities/professional-profile';

let profileCounter = 0;

export function makeProfessionalProfile(
  override: Partial<ProfessionalProfileProps> = {},
  id?: UniqueEntityID,
) {
  profileCounter++;

  return ProfessionalProfile.create(
    {
      userId: new UniqueEntityID(),
      type: 'prescriber',
      registrationNumber: `CRM-${profileCounter.toString().padStart(6, '0')}`,
      registrationState: 'SP',
      ...override,
    },
    id,
  );
}
