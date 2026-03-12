import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface AssociationMemberProps {
  associationId: UniqueEntityID;
  userId: UniqueEntityID;
  role: string; // AssociationMemberRole enum
  status: string; // AssociationMemberStatus enum
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

  changeRole(role: string) {
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
