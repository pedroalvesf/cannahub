import { DocumentsRepository } from '@/domain/patient/application/repositories/documents-repository';
import { Document } from '@/domain/patient/enterprise/entities/document';

export class InMemoryDocumentsRepository implements DocumentsRepository {
  public items: Document[] = [];

  async findById(id: string): Promise<Document | null> {
    const item = this.items.find((i) => i.id.toString() === id);
    return item ?? null;
  }

  async findByUserId(userId: string): Promise<Document[]> {
    return this.items.filter((i) => i.userId.toString() === userId);
  }

  async findByDependentId(dependentId: string): Promise<Document[]> {
    return this.items.filter(
      (i) => i.dependentId?.toString() === dependentId,
    );
  }

  async findPendingDocuments(): Promise<Document[]> {
    return this.items
      .filter((i) => i.status === 'pending')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async create(document: Document): Promise<void> {
    this.items.push(document);
  }

  async save(document: Document): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === document.id.toString(),
    );
    if (index >= 0) {
      this.items[index] = document;
    }
  }
}
