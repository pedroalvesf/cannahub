import { UseCaseError } from '@/core/errors/use-case-error';

export class NotEntryOwnerError extends Error implements UseCaseError {
  constructor() {
    super('Você não tem permissão para acessar esta entrada.');
  }
}
