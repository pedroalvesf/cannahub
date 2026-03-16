import {
  OnboardingSession as PrismaOnboardingSession,
  Prisma,
} from '@/generated/prisma/client';
import {
  OnboardingSession,
  OnboardingStepResponse,
} from '@/domain/onboarding/enterprise/entities/onboarding-session';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaOnboardingSessionMapper {
  static toDomain(raw: PrismaOnboardingSession): OnboardingSession {
    return OnboardingSession.create(
      {
        userId: new UniqueEntityID(raw.userId),
        status: raw.status,
        currentStep: raw.currentStep,
        condition: raw.condition ?? undefined,
        experience: raw.experience ?? undefined,
        preferredForm: raw.preferredForm ?? undefined,
        hasPrescription: raw.hasPrescription ?? undefined,
        needsDoctor: raw.needsDoctor ?? undefined,
        assistedAccess: raw.assistedAccess ?? undefined,
        growingInterest: raw.growingInterest ?? undefined,
        rawResponses:
          (raw.rawResponses as unknown as OnboardingStepResponse[]) ?? [],
        summary: raw.summary ?? undefined,
        escalatedAt: raw.escalatedAt ?? undefined,
        escalatedReason: raw.escalatedReason ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaCreate(
    session: OnboardingSession,
  ): Prisma.OnboardingSessionUncheckedCreateInput {
    return {
      id: session.id.toString(),
      userId: session.userId.toString(),
      status: session.status,
      currentStep: session.currentStep,
      condition: session.condition ?? null,
      experience: session.experience ?? null,
      preferredForm: session.preferredForm ?? null,
      hasPrescription: session.hasPrescription ?? null,
      needsDoctor: session.needsDoctor ?? null,
      assistedAccess: session.assistedAccess ?? null,
      growingInterest: session.growingInterest ?? null,
      rawResponses:
        session.rawResponses as unknown as Prisma.InputJsonValue,
      summary: session.summary ?? null,
      escalatedAt: session.escalatedAt ?? null,
      escalatedReason: session.escalatedReason ?? null,
    };
  }

  static toPrismaUpdate(
    session: OnboardingSession,
  ): Prisma.OnboardingSessionUncheckedUpdateInput {
    return {
      status: session.status,
      currentStep: session.currentStep,
      condition: session.condition ?? null,
      experience: session.experience ?? null,
      preferredForm: session.preferredForm ?? null,
      hasPrescription: session.hasPrescription ?? null,
      needsDoctor: session.needsDoctor ?? null,
      assistedAccess: session.assistedAccess ?? null,
      growingInterest: session.growingInterest ?? null,
      rawResponses:
        session.rawResponses as unknown as Prisma.InputJsonValue,
      summary: session.summary ?? null,
      escalatedAt: session.escalatedAt ?? null,
      escalatedReason: session.escalatedReason ?? null,
    };
  }
}
