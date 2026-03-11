import { UseCaseError } from '@/core/errors/use-case-error';

export class SessionAlreadyCompletedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Onboarding session has already been completed.');
  }
}
