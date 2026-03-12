import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface DocumentProps {
  userId: UniqueEntityID;
  dependentId?: UniqueEntityID;
  type: string; // DocumentType enum
  url: string;
  status: string; // DocumentStatus enum
  rejectionReason?: string;
  reviewedBy?: UniqueEntityID;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export class Document extends Entity<DocumentProps> {
  get userId() {
    return this.props.userId;
  }

  get dependentId() {
    return this.props.dependentId;
  }

  get type() {
    return this.props.type;
  }

  get url() {
    return this.props.url;
  }

  get status() {
    return this.props.status;
  }

  get rejectionReason() {
    return this.props.rejectionReason;
  }

  get reviewedBy() {
    return this.props.reviewedBy;
  }

  get reviewedAt() {
    return this.props.reviewedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  approve(reviewerId: UniqueEntityID) {
    this.props.status = 'approved';
    this.props.reviewedBy = reviewerId;
    this.props.reviewedAt = new Date();
    this.props.rejectionReason = undefined;
    this.touch();
  }

  reject(reviewerId: UniqueEntityID, reason: string) {
    this.props.status = 'rejected';
    this.props.reviewedBy = reviewerId;
    this.props.reviewedAt = new Date();
    this.props.rejectionReason = reason;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<DocumentProps, 'createdAt' | 'updatedAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    return new Document(
      {
        ...props,
        status: props.status ?? 'pending',
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
