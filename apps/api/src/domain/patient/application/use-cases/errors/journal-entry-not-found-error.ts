import { UseCaseError } from '@/core/errors/use-case-error';

export class JournalEntryNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Entrada do diário não encontrada.');
  }
}
