import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DiaryFollowUpSymptomProps {
  followUpId: UniqueEntityID
  symptomLogId: UniqueEntityID
  severityAfter: number // 0..10
}

export class DiaryFollowUpSymptom extends Entity<DiaryFollowUpSymptomProps> {
  get followUpId() {
    return this.props.followUpId
  }

  get symptomLogId() {
    return this.props.symptomLogId
  }

  get severityAfter() {
    return this.props.severityAfter
  }

  set severityAfter(value: number) {
    this.props.severityAfter = value
  }

  static create(props: DiaryFollowUpSymptomProps, id?: UniqueEntityID) {
    return new DiaryFollowUpSymptom(props, id)
  }
}
