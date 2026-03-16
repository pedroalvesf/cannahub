import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface OnboardingStepResponse {
  step: number;
  input: string;
  extractedData?: Record<string, unknown>;
  timestamp: Date;
}

export interface OnboardingSessionProps {
  userId: UniqueEntityID;
  status: string;
  currentStep: number;
  condition?: string;
  experience?: string;
  preferredForm?: string;
  hasPrescription?: boolean;
  needsDoctor?: boolean;
  assistedAccess?: boolean;
  growingInterest?: boolean;
  rawResponses: OnboardingStepResponse[];
  summary?: string;
  escalatedAt?: Date;
  escalatedReason?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class OnboardingSession extends Entity<OnboardingSessionProps> {
  get userId() {
    return this.props.userId;
  }

  get status() {
    return this.props.status;
  }

  get currentStep() {
    return this.props.currentStep;
  }

  get condition() {
    return this.props.condition;
  }

  get experience() {
    return this.props.experience;
  }

  get preferredForm() {
    return this.props.preferredForm;
  }

  get hasPrescription() {
    return this.props.hasPrescription;
  }

  get needsDoctor() {
    return this.props.needsDoctor;
  }

  get assistedAccess() {
    return this.props.assistedAccess;
  }

  get growingInterest() {
    return this.props.growingInterest;
  }

  get rawResponses() {
    return this.props.rawResponses;
  }

  get summary() {
    return this.props.summary;
  }

  get escalatedAt() {
    return this.props.escalatedAt;
  }

  get escalatedReason() {
    return this.props.escalatedReason;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  advanceStep() {
    this.props.currentStep += 1;
    this.touch();
  }

  updateFields(fields: Partial<OnboardingSessionProps>) {
    if (fields.condition !== undefined) this.props.condition = fields.condition;
    if (fields.experience !== undefined)
      this.props.experience = fields.experience;
    if (fields.preferredForm !== undefined)
      this.props.preferredForm = fields.preferredForm;
    if (fields.hasPrescription !== undefined)
      this.props.hasPrescription = fields.hasPrescription;
    if (fields.needsDoctor !== undefined)
      this.props.needsDoctor = fields.needsDoctor;
    if (fields.assistedAccess !== undefined)
      this.props.assistedAccess = fields.assistedAccess;
    if (fields.growingInterest !== undefined)
      this.props.growingInterest = fields.growingInterest;
    this.touch();
  }

  addRawResponse(response: OnboardingStepResponse) {
    this.props.rawResponses.push(response);
    this.touch();
  }

  setSummary(summary: string) {
    this.props.summary = summary;
    this.touch();
  }

  complete() {
    this.props.status = 'completed';
    this.touch();
  }

  awaitPrescription() {
    this.props.status = 'awaiting_prescription';
    this.touch();
  }

  escalate(reason: string) {
    this.props.status = 'escalated';
    this.props.escalatedAt = new Date();
    this.props.escalatedReason = reason;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      OnboardingSessionProps,
      'status' | 'currentStep' | 'rawResponses' | 'createdAt' | 'updatedAt'
    >,
    id?: UniqueEntityID,
  ) {
    return new OnboardingSession(
      {
        ...props,
        status: props.status ?? 'in_progress',
        currentStep: props.currentStep ?? 1,
        rawResponses: props.rawResponses ?? [],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
