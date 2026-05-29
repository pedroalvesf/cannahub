import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { DiaryFollowUpSymptom } from './diary-follow-up-symptom'
import { DiaryEffectLog } from './diary-effect-log'

export interface DiaryFollowUpProps {
  diaryEntryId: UniqueEntityID
  evaluatedAt: Date
  notes?: string
  tags: string[]
  symptomAssessments: DiaryFollowUpSymptom[]
  effects: DiaryEffectLog[]
  createdAt: Date
  updatedAt?: Date
}

export class DiaryFollowUp extends Entity<DiaryFollowUpProps> {
  get diaryEntryId() {
    return this.props.diaryEntryId
  }

  get evaluatedAt() {
    return this.props.evaluatedAt
  }

  get notes() {
    return this.props.notes
  }

  get tags() {
    return this.props.tags
  }

  get symptomAssessments() {
    return this.props.symptomAssessments
  }

  get effects() {
    return this.props.effects
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set evaluatedAt(value: Date) {
    this.props.evaluatedAt = value
    this.touch()
  }

  set notes(value: string | undefined) {
    this.props.notes = value
    this.touch()
  }

  set tags(value: string[]) {
    this.props.tags = value
    this.touch()
  }

  set symptomAssessments(value: DiaryFollowUpSymptom[]) {
    this.props.symptomAssessments = value
    this.touch()
  }

  set effects(value: DiaryEffectLog[]) {
    this.props.effects = value
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DiaryFollowUpProps, 'tags' | 'symptomAssessments' | 'effects' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    return new DiaryFollowUp(
      {
        ...props,
        tags: props.tags ?? [],
        symptomAssessments: props.symptomAssessments ?? [],
        effects: props.effects ?? [],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
  }
}
