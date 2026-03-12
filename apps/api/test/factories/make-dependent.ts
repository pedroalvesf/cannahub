import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Dependent,
  DependentProps,
} from '@/domain/patient/enterprise/entities/dependent';

let dependentCounter = 0;

export function makeDependent(
  override: Partial<DependentProps> = {},
  id?: UniqueEntityID,
) {
  dependentCounter++;

  return Dependent.create(
    {
      guardianUserId: new UniqueEntityID(),
      name: `Dependent ${dependentCounter}`,
      relationshipType: 'parent',
      ...override,
    },
    id,
  );
}
