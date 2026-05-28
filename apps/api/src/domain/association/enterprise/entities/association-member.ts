import { AssociationMemberRole, AssociationMemberStatus } from '@cannahub/shared';
import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export type AssociationMemberRoleValue = `${AssociationMemberRole}`;
export type AssociationMemberStatusValue = `${AssociationMemberStatus}`;

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
    this.props.status = AssociationMemberStatus.INACTIVE;
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
        role: props.role ?? AssociationMemberRole.STAFF,
        status: props.status ?? AssociationMemberStatus.ACTIVE,
        assignedAt: props.assignedAt ?? new Date(),
      },
      id,
    );
  }
}
