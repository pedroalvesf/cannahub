import { UseCaseError } from '@/core/errors/use-case-error';

export class SessionNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Onboarding session not found.');
  }
}
