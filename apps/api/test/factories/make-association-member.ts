import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  AssociationMember,
  AssociationMemberProps,
} from '@/domain/association/enterprise/entities/association-member';

export function makeAssociationMember(
  override: Partial<AssociationMemberProps> = {},
  id?: UniqueEntityID,
) {
  return AssociationMember.create(
    {
      associationId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  );
}
