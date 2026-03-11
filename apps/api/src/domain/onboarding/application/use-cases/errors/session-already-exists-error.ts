import { UseCaseError } from '@/core/errors/use-case-error';

export class SessionAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('Onboarding session already exists for this user.');
  }
}
