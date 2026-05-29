import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { DiarySymptomLog } from './diary-symptom-log'
import { DiaryFollowUp } from './diary-follow-up'

export interface DiaryEntryProps {
  userId: UniqueEntityID
  date: Date
  time: string
  productId?: UniqueEntityID
  customProductName?: string
  administrationMethod: string
  doseAmount: number
  doseUnit: string
  notes?: string
  targetCondition?: string
  isFavorite: boolean
  symptoms: DiarySymptomLog[]
  followUps: DiaryFollowUp[]
  createdAt: Date
  updatedAt?: Date
}

export class DiaryEntry extends Entity<DiaryEntryProps> {
  get userId() {
    return this.props.userId
  }

  get date() {
    return this.props.date
  }

  get time() {
    return this.props.time
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

  get notes() {
    return this.props.notes
  }

  get targetCondition() {
    return this.props.targetCondition
  }

  get isFavorite() {
    return this.props.isFavorite
  }

  get symptoms() {
    return this.props.symptoms
  }

  get followUps() {
    return this.props.followUps
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set date(value: Date) {
    this.props.date = value
    this.touch()
  }

  set time(value: string) {
    this.props.time = value
    this.touch()
  }

  set productId(value: UniqueEntityID | undefined) {
    this.props.productId = value
    this.touch()
  }

  set customProductName(value: string | undefined) {
    this.props.customProductName = value
    this.touch()
  }

  set administrationMethod(value: string) {
    this.props.administrationMethod = value
    this.touch()
  }

  set doseAmount(value: number) {
    this.props.doseAmount = value
    this.touch()
  }

  set doseUnit(value: string) {
    this.props.doseUnit = value
    this.touch()
  }

  set notes(value: string | undefined) {
    this.props.notes = value
    this.touch()
  }

  set targetCondition(value: string | undefined) {
    this.props.targetCondition = value
    this.touch()
  }

  set isFavorite(value: boolean) {
    this.props.isFavorite = value
    this.touch()
  }

  set symptoms(value: DiarySymptomLog[]) {
    this.props.symptoms = value
    this.touch()
  }

  set followUps(value: DiaryFollowUp[]) {
    this.props.followUps = value
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DiaryEntryProps, 'isFavorite' | 'symptoms' | 'followUps' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    return new DiaryEntry(
      {
        ...props,
        isFavorite: props.isFavorite ?? false,
        symptoms: props.symptoms ?? [],
        followUps: props.followUps ?? [],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
  }
}
