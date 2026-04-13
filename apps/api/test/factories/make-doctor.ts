import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Doctor,
  DoctorProps,
} from '@/domain/onboarding/enterprise/entities/doctor';

let doctorCounter = 0;

export function makeDoctor(
  override: Partial<DoctorProps> = {},
  id?: UniqueEntityID,
) {
  doctorCounter++;

  return Doctor.create(
    {
      slug: `doctor-${doctorCounter}`,
      name: `Dr. Test ${doctorCounter}`,
      crm: `CRM-SP-${doctorCounter}`,
      state: 'SP',
      specialties: ['Neurologia'],
      contactInfo: { email: `doctor${doctorCounter}@test.com` },
      ...override,
    },
    id,
  );
}
