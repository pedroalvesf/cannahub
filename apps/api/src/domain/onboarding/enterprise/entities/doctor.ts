import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface DoctorProps {
  name: string;
  crm: string;
  state: string;
  specialties: string[];
  telemedicine: boolean;
  consultationFee?: string;
  contactInfo: Record<string, unknown>;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class Doctor extends Entity<DoctorProps> {
  get name() {
    return this.props.name;
  }

  get crm() {
    return this.props.crm;
  }

  get state() {
    return this.props.state;
  }

  get specialties() {
    return this.props.specialties;
  }

  get telemedicine() {
    return this.props.telemedicine;
  }

  get consultationFee() {
    return this.props.consultationFee;
  }

  get contactInfo() {
    return this.props.contactInfo;
  }

  get active() {
    return this.props.active;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  deactivate() {
    this.props.active = false;
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<DoctorProps, 'active' | 'telemedicine' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Doctor(
      {
        ...props,
        active: props.active ?? true,
        telemedicine: props.telemedicine ?? false,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
