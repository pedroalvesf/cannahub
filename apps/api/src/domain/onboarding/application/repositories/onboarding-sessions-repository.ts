import { OnboardingSession } from '../../enterprise/entities/onboarding-session';

export abstract class OnboardingSessionsRepository {
  abstract findById(id: string): Promise<OnboardingSession | null>;
  abstract findByUserId(userId: string): Promise<OnboardingSession | null>;
  abstract create(session: OnboardingSession): Promise<void>;
  abstract save(session: OnboardingSession): Promise<void>;
}
