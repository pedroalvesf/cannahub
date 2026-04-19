import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface DoctorProps {
  slug: string;
  name: string;
  crm: string;
  state: string;
  city?: string;
  specialties: string[];
  telemedicine: boolean;
  inPerson: boolean;
  bio?: string;
  photoUrl?: string;
  consultationFee?: string;
  contactInfo: Record<string, unknown>;
  active: boolean;
  directoryListed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class Doctor extends Entity<DoctorProps> {
  get slug() {
    return this.props.slug;
  }

  get name() {
    return this.props.name;
  }

  get crm() {
    return this.props.crm;
  }

  get state() {
    return this.props.state;
  }

  get city() {
    return this.props.city;
  }

  get specialties() {
    return this.props.specialties;
  }

  get telemedicine() {
    return this.props.telemedicine;
  }

  get inPerson() {
    return this.props.inPerson;
  }

  get bio() {
    return this.props.bio;
  }

  get photoUrl() {
    return this.props.photoUrl;
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

  get directoryListed() {
    return this.props.directoryListed;
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
    props: Optional<DoctorProps, 'active' | 'telemedicine' | 'inPerson' | 'directoryListed' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Doctor(
      {
        ...props,
        active: props.active ?? true,
        telemedicine: props.telemedicine ?? false,
        inPerson: props.inPerson ?? false,
        directoryListed: props.directoryListed ?? false,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
