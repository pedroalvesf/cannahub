import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface PatientProps {
  userId?: UniqueEntityID;
  dependentId?: UniqueEntityID;
  type: string; // PatientType: SELF | DEPENDENT
  createdAt: Date;
  updatedAt?: Date;
}

export class Patient extends Entity<PatientProps> {
  get userId() {
    return this.props.userId;
  }

  get dependentId() {
    return this.props.dependentId;
  }

  get type() {
    return this.props.type;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  isSelf(): boolean {
    return this.props.type === 'self';
  }

  isDependent(): boolean {
    return this.props.type === 'dependent';
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<PatientProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const hasUserId = !!props.userId;
    const hasDependentId = !!props.dependentId;

    if (hasUserId === hasDependentId) {
      throw new Error(
        'Patient must have exactly one of userId or dependentId',
      );
    }

    if (hasUserId && props.type !== 'self') {
      throw new Error('Patient with userId must have type SELF');
    }

    if (hasDependentId && props.type !== 'dependent') {
      throw new Error('Patient with dependentId must have type DEPENDENT');
    }

    return new Patient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
