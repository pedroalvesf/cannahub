import { UseCaseError } from '@/core/errors/use-case-error';

export class DocumentNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Document not found.');
  }
}
