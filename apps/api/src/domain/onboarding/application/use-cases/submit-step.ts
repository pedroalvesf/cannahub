import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { OnboardingSession } from '../../enterprise/entities/onboarding-session';
import { OnboardingSessionsRepository } from '../repositories/onboarding-sessions-repository';
import { SessionNotFoundError } from './errors/session-not-found-error';
import { SessionAlreadyCompletedError } from './errors/session-already-completed-error';

interface SubmitStepRequest {
  userId: string;
  stepNumber: number;
  input: string;
  selectedOption?: string;
}

type SubmitStepResponse = Either<
  SessionNotFoundError | SessionAlreadyCompletedError,
  { session: OnboardingSession; extractedFields?: Record<string, unknown> }
>;

const STEP_FIELD_MAP: Record<number, string> = {
  1: 'condition',
  2: 'experience',
  3: 'hasPrescription',
  4: 'preferredForm',
  5: 'assistedAccess',
  6: 'currentAccessMethod',
};

@Injectable()
export class SubmitStepUseCase {
  constructor(
    private onboardingSessionsRepository: OnboardingSessionsRepository,
  ) {}

  async execute({
    userId,
    stepNumber,
    input,
    selectedOption,
  }: SubmitStepRequest): Promise<SubmitStepResponse> {
    const session =
      await this.onboardingSessionsRepository.findByUserId(userId);

    if (!session) {
      return left(new SessionNotFoundError());
    }

    if (session.status === 'completed') {
      return left(new SessionAlreadyCompletedError());
    }

    // Mapeia a resposta (card ou texto livre) para campos estruturados
    // TODO: para texto livre, substituir por aiExtractor.extractFromText() quando ANTHROPIC_API_KEY estiver configurada
    let extractedFields: Record<string, unknown> | undefined;

    if (selectedOption) {
      extractedFields = this.mapOptionToFields(stepNumber, selectedOption);
    } else if (input) {
      // Sem IA: salva texto direto no campo correspondente ao step
      const field = STEP_FIELD_MAP[stepNumber];
      if (field) {
        extractedFields = { [field]: input };
      }
    }

    session.addRawResponse({
      step: stepNumber,
      input: selectedOption ?? input,
      extractedData: extractedFields,
      timestamp: new Date(),
    });

    if (extractedFields) {
      session.updateFields(extractedFields);
    }

    session.advanceStep();

    await this.onboardingSessionsRepository.save(session);

    return right({ session, extractedFields });
  }

  private mapOptionToFields(
    step: number,
    option: string,
  ): Record<string, unknown> {
    const field = STEP_FIELD_MAP[step];
    if (!field) return {};

    if (field === 'hasPrescription') {
      const needsDoctor = option === 'no';
      return {
        hasPrescription: option === 'yes',
        needsDoctor,
      };
    }

    if (field === 'assistedAccess') {
      return { assistedAccess: option === 'yes' };
    }

    return { [field]: option };
  }
}
