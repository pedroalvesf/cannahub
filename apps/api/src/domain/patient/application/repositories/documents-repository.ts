import { Document } from '@/domain/patient/enterprise/entities/document';

export abstract class DocumentsRepository {
  abstract findById(id: string): Promise<Document | null>;
  abstract findByUserId(userId: string): Promise<Document[]>;
  abstract findByDependentId(dependentId: string): Promise<Document[]>;
  abstract findPendingDocuments(): Promise<Document[]>;
  abstract create(document: Document): Promise<void>;
  abstract save(document: Document): Promise<void>;
}
