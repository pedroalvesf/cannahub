import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DiaryEffectLogProps {
  diaryEntryId: UniqueEntityID
  effectKey: string
  isPositive: boolean
  customEffectName?: string
}

export class DiaryEffectLog extends Entity<DiaryEffectLogProps> {
  get diaryEntryId() {
    return this.props.diaryEntryId
  }

  get effectKey() {
    return this.props.effectKey
  }

  get isPositive() {
    return this.props.isPositive
  }

  get customEffectName() {
    return this.props.customEffectName
  }

  static create(props: DiaryEffectLogProps, id?: UniqueEntityID) {
    return new DiaryEffectLog(props, id)
  }
}
