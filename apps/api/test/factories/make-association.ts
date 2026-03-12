import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Association,
  AssociationProps,
} from '@/domain/association/enterprise/entities/association';

let associationCounter = 0;

export function makeAssociation(
  override: Partial<AssociationProps> = {},
  id?: UniqueEntityID,
) {
  associationCounter++;

  return Association.create(
    {
      name: `Association ${associationCounter}`,
      cnpj: `${associationCounter.toString().padStart(14, '0')}`,
      region: 'Sudeste',
      state: 'SP',
      city: 'São Paulo',
      contactEmail: `contact-${associationCounter}@association.org`,
      ...override,
    },
    id,
  );
}
