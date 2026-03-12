import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Patient,
  PatientProps,
} from '@/domain/patient/enterprise/entities/patient';

export function makePatient(
  override: Partial<PatientProps> = {},
  id?: UniqueEntityID,
) {
  const type = override.type ?? 'self';
  const defaults: Partial<PatientProps> =
    type === 'self'
      ? { userId: new UniqueEntityID(), type: 'self' }
      : { dependentId: new UniqueEntityID(), type: 'dependent' };

  return Patient.create(
    {
      ...defaults,
      ...override,
    } as PatientProps,
    id,
  );
}
