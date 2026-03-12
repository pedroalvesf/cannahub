import { Injectable } from '@nestjs/common';
import { DocumentsRepository } from '@/domain/patient/application/repositories/documents-repository';
import { Document } from '@/domain/patient/enterprise/entities/document';
import { PrismaService } from '../prisma.service';
import { PrismaDocumentMapper } from '../mappers/prisma-document-mapper';

@Injectable()
export class PrismaDocumentsRepository implements DocumentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Document | null> {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });
    return document ? PrismaDocumentMapper.toDomain(document) : null;
  }

  async findByUserId(userId: string): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      where: { userId },
    });
    return documents.map(PrismaDocumentMapper.toDomain);
  }

  async findByDependentId(dependentId: string): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      where: { dependentId },
    });
    return documents.map(PrismaDocumentMapper.toDomain);
  }

  async findPendingDocuments(): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
    });
    return documents.map(PrismaDocumentMapper.toDomain);
  }

  async create(document: Document): Promise<void> {
    const data = PrismaDocumentMapper.toPrisma(document);
    await this.prisma.document.create({ data });
  }

  async save(document: Document): Promise<void> {
    const data = PrismaDocumentMapper.toPrismaUpdate(document);
    await this.prisma.document.update({
      where: { id: document.id.toString() },
      data,
    });
  }
}
