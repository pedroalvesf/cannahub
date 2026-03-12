import { AssociationMember } from '@/domain/association/enterprise/entities/association-member';

export abstract class AssociationMembersRepository {
  abstract findById(id: string): Promise<AssociationMember | null>;
  abstract findByAssociationId(
    associationId: string,
  ): Promise<AssociationMember[]>;
  abstract findByUserId(userId: string): Promise<AssociationMember[]>;
  abstract findByAssociationAndUser(
    associationId: string,
    userId: string,
  ): Promise<AssociationMember | null>;
  abstract create(member: AssociationMember): Promise<void>;
  abstract save(member: AssociationMember): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
