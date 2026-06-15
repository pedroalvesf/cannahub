import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface DiaryFavoriteProps {
  userId: UniqueEntityID
  name: string
  productId?: UniqueEntityID
  customProductName?: string
  administrationMethod: string
  doseAmount: number
  doseUnit: string
  symptomKeys: string[]
  createdAt: Date
}

export class DiaryFavorite extends Entity<DiaryFavoriteProps> {
  get userId() {
    return this.props.userId
  }

  get name() {
    return this.props.name
  }

  get productId() {
    return this.props.productId
  }

  get customProductName() {
    return this.props.customProductName
  }

  get administrationMethod() {
    return this.props.administrationMethod
  }

  get doseAmount() {
    return this.props.doseAmount
  }

  get doseUnit() {
    return this.props.doseUnit
  }

  get symptomKeys() {
    return this.props.symptomKeys
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<DiaryFavoriteProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new DiaryFavorite(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
