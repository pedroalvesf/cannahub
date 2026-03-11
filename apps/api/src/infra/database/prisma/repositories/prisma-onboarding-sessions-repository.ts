import { Injectable } from '@nestjs/common';
import { OnboardingSessionsRepository } from '@/domain/onboarding/application/repositories/onboarding-sessions-repository';
import { OnboardingSession } from '@/domain/onboarding/enterprise/entities/onboarding-session';
import { PrismaService } from '../prisma.service';
import { PrismaOnboardingSessionMapper } from '../mappers/prisma-onboarding-session-mapper';

@Injectable()
export class PrismaOnboardingSessionsRepository
  implements OnboardingSessionsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<OnboardingSession | null> {
    const raw = await this.prisma.onboardingSession.findUnique({
      where: { id },
    });

    if (!raw) return null;

    return PrismaOnboardingSessionMapper.toDomain(raw);
  }

  async findByUserId(userId: string): Promise<OnboardingSession | null> {
    const raw = await this.prisma.onboardingSession.findUnique({
      where: { userId },
    });

    if (!raw) return null;

    return PrismaOnboardingSessionMapper.toDomain(raw);
  }

  async create(session: OnboardingSession): Promise<void> {
    const data = PrismaOnboardingSessionMapper.toPrismaCreate(session);

    await this.prisma.onboardingSession.create({ data });
  }

  async save(session: OnboardingSession): Promise<void> {
    const data = PrismaOnboardingSessionMapper.toPrismaUpdate(session);

    await this.prisma.onboardingSession.update({
      where: { id: session.id.toString() },
      data,
    });
  }
}
