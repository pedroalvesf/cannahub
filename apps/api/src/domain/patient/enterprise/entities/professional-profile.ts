import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface ProfessionalProfileProps {
  userId: UniqueEntityID;
  type: string; // ProfessionalType enum
  registrationNumber: string;
  registrationState: string;
  specialty?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export class ProfessionalProfile extends Entity<ProfessionalProfileProps> {
  get userId() {
    return this.props.userId;
  }

  get type() {
    return this.props.type;
  }

  get registrationNumber() {
    return this.props.registrationNumber;
  }

  get registrationState() {
    return this.props.registrationState;
  }

  get specialty() {
    return this.props.specialty;
  }

  get verifiedAt() {
    return this.props.verifiedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  verify() {
    this.props.verifiedAt = new Date();
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<ProfessionalProfileProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    return new ProfessionalProfile(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
