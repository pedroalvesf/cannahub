import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DiarySymptomLogProps {
  diaryEntryId: UniqueEntityID
  symptomKey: string
  customSymptomName?: string
  severityBefore: number
}

export class DiarySymptomLog extends Entity<DiarySymptomLogProps> {
  get diaryEntryId() {
    return this.props.diaryEntryId
  }

  get symptomKey() {
    return this.props.symptomKey
  }

  get customSymptomName() {
    return this.props.customSymptomName
  }

  get severityBefore() {
    return this.props.severityBefore
  }

  static create(props: DiarySymptomLogProps, id?: UniqueEntityID) {
    return new DiarySymptomLog(props, id)
  }
}
