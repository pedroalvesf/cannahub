import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { OnboardingSession } from '../../enterprise/entities/onboarding-session';
import { OnboardingSessionsRepository } from '../repositories/onboarding-sessions-repository';
import { AiExtractor } from '../ai/ai-extractor';
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

@Injectable()
export class SubmitStepUseCase {
  constructor(
    private onboardingSessionsRepository: OnboardingSessionsRepository,
    private aiExtractor: AiExtractor,
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

    // Se o paciente selecionou uma opção via card, usa direto
    // Se digitou texto livre, extrai com IA
    let extractedFields: Record<string, unknown> | undefined;

    if (selectedOption) {
      extractedFields = this.mapOptionToFields(stepNumber, selectedOption);
    } else if (input) {
      const extracted = await this.aiExtractor.extractFromText(input);
      extractedFields = extracted as Record<string, unknown>;
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
    const stepFieldMap: Record<number, string> = {
      1: 'condition',
      2: 'accountType',
      3: 'experience',
      4: 'hasPrescription',
      5: 'preferredForm',
      6: 'assistedAccess',
    };

    const field = stepFieldMap[step];
    if (!field) return {};

    // Step 4 retorna boolean
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
