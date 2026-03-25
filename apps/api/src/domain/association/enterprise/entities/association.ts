import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface AssociationProps {
  name: string;
  cnpj: string;
  status: string; // AssociationStatus enum
  description?: string;
  region: string;
  state: string;
  city: string;
  profileTypes: string[];
  hasAssistedAccess: boolean;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  logoUrl?: string;
  claimedAt?: Date;
  membershipFee?: number;
  membershipPeriod?: string; // annual | semiannual | monthly | none
  membershipDescription?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Association extends AggregateRoot<AssociationProps> {
  get name() {
    return this.props.name;
  }

  get cnpj() {
    return this.props.cnpj;
  }

  get status() {
    return this.props.status;
  }

  get description() {
    return this.props.description;
  }

  get region() {
    return this.props.region;
  }

  get state() {
    return this.props.state;
  }

  get city() {
    return this.props.city;
  }

  get profileTypes() {
    return this.props.profileTypes;
  }

  get hasAssistedAccess() {
    return this.props.hasAssistedAccess;
  }

  get contactEmail() {
    return this.props.contactEmail;
  }

  get contactPhone() {
    return this.props.contactPhone;
  }

  get website() {
    return this.props.website;
  }

  get logoUrl() {
    return this.props.logoUrl;
  }

  get claimedAt() {
    return this.props.claimedAt;
  }

  get membershipFee() {
    return this.props.membershipFee;
  }

  get membershipPeriod() {
    return this.props.membershipPeriod;
  }

  get membershipDescription() {
    return this.props.membershipDescription;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  verify() {
    this.props.status = 'verified';
    this.touch();
  }

  suspend() {
    this.props.status = 'suspended';
    this.touch();
  }

  claim() {
    this.props.claimedAt = new Date();
    this.touch();
  }

  updateProfile(
    fields: Partial<
      Pick<
        AssociationProps,
        | 'description'
        | 'contactEmail'
        | 'contactPhone'
        | 'website'
        | 'logoUrl'
        | 'membershipFee'
        | 'membershipPeriod'
        | 'membershipDescription'
      >
    >,
  ) {
    Object.assign(this.props, fields);
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      AssociationProps,
      'createdAt' | 'updatedAt' | 'status' | 'hasAssistedAccess' | 'profileTypes'
    >,
    id?: UniqueEntityID,
  ) {
    return new Association(
      {
        ...props,
        status: props.status ?? 'pending_verification',
        hasAssistedAccess: props.hasAssistedAccess ?? false,
        profileTypes: props.profileTypes ?? [],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
