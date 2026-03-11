import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  OnboardingSession,
  OnboardingSessionProps,
} from '@/domain/onboarding/enterprise/entities/onboarding-session';

export function makeOnboardingSession(
  override: Partial<OnboardingSessionProps> = {},
  id?: UniqueEntityID,
) {
  return OnboardingSession.create(
    {
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  );
}
