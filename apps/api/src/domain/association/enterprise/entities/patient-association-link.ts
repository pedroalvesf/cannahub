import { PatientAssociationStatus } from '@cannahub/shared';
import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export type PatientAssociationStatusValue = `${PatientAssociationStatus}`;
export type FeeStatus = 'pending' | 'paid' | 'overdue' | 'exempt';

export interface PatientAssociationLinkProps {
  associationId: UniqueEntityID;
  patientId: UniqueEntityID;
  requestedByUserId: UniqueEntityID;
  status: PatientAssociationStatusValue;
  approvedByUserId?: UniqueEntityID;
  startDate?: Date;
  endDate?: Date;
  feeStatus?: FeeStatus;
  feeExpiresAt?: Date;
  feePaidAt?: Date;
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

  get feeStatus() {
    return this.props.feeStatus;
  }

  get feeExpiresAt() {
    return this.props.feeExpiresAt;
  }

  get feePaidAt() {
    return this.props.feePaidAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  approve(approvedBy: UniqueEntityID) {
    this.props.status = PatientAssociationStatus.ACTIVE;
    this.props.approvedByUserId = approvedBy;
    this.props.startDate = new Date();
    this.touch();
  }

  reject() {
    this.props.status = PatientAssociationStatus.REJECTED;
    this.touch();
  }

  cancel() {
    this.props.status = PatientAssociationStatus.CANCELLED;
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
        status: props.status ?? PatientAssociationStatus.REQUESTED,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
