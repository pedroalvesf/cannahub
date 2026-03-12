import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  PatientAssociationLink,
  PatientAssociationLinkProps,
} from '@/domain/association/enterprise/entities/patient-association-link';

export function makePatientAssociationLink(
  override: Partial<PatientAssociationLinkProps> = {},
  id?: UniqueEntityID,
) {
  return PatientAssociationLink.create(
    {
      associationId: new UniqueEntityID(),
      patientId: new UniqueEntityID(),
      requestedByUserId: new UniqueEntityID(),
      ...override,
    },
    id,
  );
}
