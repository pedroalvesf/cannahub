import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface AddressProps {
  userId: UniqueEntityID;
  street: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Address extends Entity<AddressProps> {
  get userId() {
    return this.props.userId;
  }

  get street() {
    return this.props.street;
  }

  set street(street: string) {
    this.props.street = street;
    this.touch();
  }

  get complement() {
    return this.props.complement;
  }

  set complement(complement: string | undefined) {
    this.props.complement = complement;
    this.touch();
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood;
    this.touch();
  }

  get city() {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
    this.touch();
  }

  get state() {
    return this.props.state;
  }

  set state(state: string) {
    this.props.state = state;
    this.touch();
  }

  get zipCode() {
    return this.props.zipCode;
  }

  set zipCode(zipCode: string) {
    this.props.zipCode = zipCode;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<AddressProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    return new Address(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
