import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { OnboardingSession } from '../../enterprise/entities/onboarding-session';
import { OnboardingSessionsRepository } from '../repositories/onboarding-sessions-repository';
import { SessionNotFoundError } from './errors/session-not-found-error';
import { SessionAlreadyCompletedError } from './errors/session-already-completed-error';

interface CompleteOnboardingRequest {
  userId: string;
}

type CompleteOnboardingResponse = Either<
  SessionNotFoundError | SessionAlreadyCompletedError,
  { session: OnboardingSession }
>;

// Labels para gerar resumo legível
const CONDITION_LABELS: Record<string, string> = {
  chronic_pain: 'Dor Crônica',
  anxiety: 'Ansiedade',
  epilepsy: 'Epilepsia',
  autism: 'Autismo / TEA',
  parkinsons: 'Parkinson',
  multiple_sclerosis: 'Esclerose Múltipla',
  fibromyalgia: 'Fibromialgia',
  nausea: 'Náusea',
  adhd: 'TDAH',
  ptsd: 'PTSD',
  veterinary: 'Uso Veterinário',
};

const EXPERIENCE_LABELS: Record<string, string> = {
  never: 'Nunca usou',
  less_than_6m: 'Menos de 6 meses',
  '6m_to_1y': '6 meses a 1 ano',
  '1y_to_3y': '1 a 3 anos',
  more_than_3y: 'Mais de 3 anos',
};

const FORM_LABELS: Record<string, string> = {
  sublingual_oil: 'Óleo sublingual',
  vaporization: 'Vaporização',
  smoking: 'Fumo',
  topical: 'Uso tópico',
  capsule: 'Cápsula',
  edible: 'Comestível',
};

const ACCESS_LABELS: Record<string, string> = {
  regulated_association: 'Associação regulamentada',
  anvisa_import: 'Importação via Anvisa',
  informal: 'Acesso informal',
  self_cultivation: 'Autocultivo',
  not_accessing: 'Ainda não acessa',
};

@Injectable()
export class CompleteOnboardingUseCase {
  constructor(
    private onboardingSessionsRepository: OnboardingSessionsRepository,
  ) {}

  async execute({
    userId,
  }: CompleteOnboardingRequest): Promise<CompleteOnboardingResponse> {
    const session =
      await this.onboardingSessionsRepository.findByUserId(userId);

    if (!session) {
      return left(new SessionNotFoundError());
    }

    if (session.status === 'completed') {
      return left(new SessionAlreadyCompletedError());
    }

    // Gera resumo estruturado com os dados coletados
    // TODO: substituir por aiExtractor.generateSummary() quando ANTHROPIC_API_KEY estiver configurada
    const summary = this.buildSummary(session);
    session.setSummary(summary);

    if (session.hasPrescription === false) {
      session.awaitPrescription();
    } else {
      session.complete();
    }

    await this.onboardingSessionsRepository.save(session);

    return right({ session });
  }

  private buildSummary(session: OnboardingSession): string {
    const parts: string[] = [];

    const condition = session.condition;
    if (condition) {
      const label = CONDITION_LABELS[condition] ?? condition;
      parts.push(`Condição principal: ${label}`);
    }

    const experience = session.experience;
    if (experience) {
      const label = EXPERIENCE_LABELS[experience] ?? experience;
      parts.push(`Experiência com cannabis: ${label}`);
    }

    const form = session.preferredForm;
    if (form) {
      const label = FORM_LABELS[form] ?? form;
      parts.push(`Forma de uso preferida: ${label}`);
    }

    if (session.hasPrescription !== undefined) {
      parts.push(
        `Receita médica: ${session.hasPrescription ? 'Sim' : 'Não'}`,
      );
    }

    if (session.assistedAccess !== undefined) {
      parts.push(
        `Acesso assistido: ${session.assistedAccess ? 'Sim' : 'Não'}`,
      );
    }

    const accessMethod = session.currentAccessMethod;
    if (accessMethod) {
      const label = ACCESS_LABELS[accessMethod] ?? accessMethod;
      parts.push(`Forma de acesso atual: ${label}`);
    }

    return parts.join('. ') + '.';
  }
}
