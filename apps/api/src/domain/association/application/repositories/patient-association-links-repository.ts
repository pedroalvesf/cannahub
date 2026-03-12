import { PatientAssociationLink } from '@/domain/association/enterprise/entities/patient-association-link';

export abstract class PatientAssociationLinksRepository {
  abstract findById(id: string): Promise<PatientAssociationLink | null>;
  abstract findByPatientId(
    patientId: string,
  ): Promise<PatientAssociationLink[]>;
  abstract findByAssociationId(
    associationId: string,
  ): Promise<PatientAssociationLink[]>;
  abstract findByAssociationAndPatient(
    associationId: string,
    patientId: string,
  ): Promise<PatientAssociationLink | null>;
  abstract create(link: PatientAssociationLink): Promise<void>;
  abstract save(link: PatientAssociationLink): Promise<void>;
}
