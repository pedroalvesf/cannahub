import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface PatientAssociationLinkProps {
  associationId: UniqueEntityID;
  patientId: UniqueEntityID;
  requestedByUserId: UniqueEntityID;
  status: string; // PatientAssociationStatus enum
  approvedByUserId?: UniqueEntityID;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export class PatientAssociationLink extends Entity<PatientAssociationLinkProps> {
  get associationId() {
    return this.props.associationId;
  }

  get patientId() {
    return this.props.patientId;
  }

  get requestedByUserId() {
    return this.props.requestedByUserId;
  }

  get status() {
    return this.props.status;
  }

  get approvedByUserId() {
    return this.props.approvedByUserId;
  }

  get startDate() {
    return this.props.startDate;
  }

  get endDate() {
    return this.props.endDate;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  approve(approvedBy: UniqueEntityID) {
    this.props.status = 'active';
    this.props.approvedByUserId = approvedBy;
    this.props.startDate = new Date();
    this.touch();
  }

  reject() {
    this.props.status = 'rejected';
    this.touch();
  }

  cancel() {
    this.props.status = 'cancelled';
    this.props.endDate = new Date();
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      PatientAssociationLinkProps,
      'createdAt' | 'updatedAt' | 'status'
    >,
    id?: UniqueEntityID,
  ) {
    return new PatientAssociationLink(
      {
        ...props,
        status: props.status ?? 'requested',
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
