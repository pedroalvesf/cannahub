import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

// Mirrors @cannahub/shared AssociationMemberRole / AssociationMemberStatus.
// Inlined as literals to avoid runtime import of the shared package's
// TS enums (Node strip-only mode can't transpile them).
export type AssociationMemberRoleValue = 'owner' | 'admin' | 'staff';
export type AssociationMemberStatusValue = 'active' | 'inactive';

export interface AssociationMemberProps {
  associationId: UniqueEntityID;
  userId: UniqueEntityID;
  role: AssociationMemberRoleValue;
  status: AssociationMemberStatusValue;
  assignedAt: Date;
}

export class AssociationMember extends Entity<AssociationMemberProps> {
  get associationId() {
    return this.props.associationId;
  }

  get userId() {
    return this.props.userId;
  }

  get role() {
    return this.props.role;
  }

  get status() {
    return this.props.status;
  }

  get assignedAt() {
    return this.props.assignedAt;
  }

  deactivate() {
    this.props.status = 'inactive';
  }

  changeRole(role: AssociationMemberRoleValue) {
    this.props.role = role;
  }

  static create(
    props: Optional<AssociationMemberProps, 'assignedAt' | 'role' | 'status'>,
    id?: UniqueEntityID,
  ) {
    return new AssociationMember(
      {
        ...props,
        role: props.role ?? 'staff',
        status: props.status ?? 'active',
        assignedAt: props.assignedAt ?? new Date(),
      },
      id,
    );
  }
}
