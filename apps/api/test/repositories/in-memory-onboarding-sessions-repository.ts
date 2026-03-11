import { OnboardingSessionsRepository } from '@/domain/onboarding/application/repositories/onboarding-sessions-repository';
import { OnboardingSession } from '@/domain/onboarding/enterprise/entities/onboarding-session';

export class InMemoryOnboardingSessionsRepository
  implements OnboardingSessionsRepository
{
  public items: OnboardingSession[] = [];

  async findById(id: string): Promise<OnboardingSession | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null;
  }

  async findByUserId(userId: string): Promise<OnboardingSession | null> {
    return (
      this.items.find((item) => item.userId.toString() === userId) ?? null
    );
  }

  async create(session: OnboardingSession): Promise<void> {
    this.items.push(session);
  }

  async save(session: OnboardingSession): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === session.id.toString(),
    );
    if (index >= 0) {
      this.items[index] = session;
    }
  }
}
