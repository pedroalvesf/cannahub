import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

// Mirrors @cannahub/shared PatientAssociationStatus. Inlined as literals
// to avoid runtime import of the shared package's TS enum.
export type PatientAssociationStatusValue =
  | 'requested'
  | 'active'
  | 'rejected'
  | 'cancelled';
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
  documentsShared: boolean;
  documentsSharedAt?: Date;
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

  get documentsShared() {
    return this.props.documentsShared;
  }

  get documentsSharedAt() {
    return this.props.documentsSharedAt;
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

  shareDocuments() {
    this.props.documentsShared = true;
    this.props.documentsSharedAt = new Date();
    this.touch();
  }

  unshareDocuments() {
    this.props.documentsShared = false;
    this.props.documentsSharedAt = undefined;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      PatientAssociationLinkProps,
      'createdAt' | 'updatedAt' | 'status' | 'documentsShared'
    >,
    id?: UniqueEntityID,
  ) {
    return new PatientAssociationLink(
      {
        ...props,
        status: props.status ?? 'requested',
        documentsShared: props.documentsShared ?? false,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
