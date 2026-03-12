import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface DependentProps {
  guardianUserId: UniqueEntityID;
  name: string;
  birthDate?: Date;
  documentNumber?: string;
  relationshipType: string;
  proofDocumentId?: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date;
}

export class Dependent extends Entity<DependentProps> {
  get guardianUserId() {
    return this.props.guardianUserId;
  }

  get name() {
    return this.props.name;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  get documentNumber() {
    return this.props.documentNumber;
  }

  get relationshipType() {
    return this.props.relationshipType;
  }

  get proofDocumentId() {
    return this.props.proofDocumentId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  set birthDate(birthDate: Date | undefined) {
    this.props.birthDate = birthDate;
    this.touch();
  }

  set documentNumber(documentNumber: string | undefined) {
    this.props.documentNumber = documentNumber;
    this.touch();
  }

  set proofDocumentId(proofDocumentId: UniqueEntityID | undefined) {
    this.props.proofDocumentId = proofDocumentId;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<DependentProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    return new Dependent(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
