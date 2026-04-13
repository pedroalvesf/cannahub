import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export type JournalVisibility = 'private' | 'shareable';

export interface TreatmentJournalEntryProps {
  userId: UniqueEntityID;
  entryDate: Date;
  mood?: number;
  symptoms: string[];
  symptomIntensity?: number;
  medicationTaken: boolean;
  dosage?: string;
  sideEffects: string[];
  notes?: string;
  visibility: JournalVisibility;
  createdAt: Date;
  updatedAt: Date;
}

export class TreatmentJournalEntry extends Entity<TreatmentJournalEntryProps> {
  get userId() {
    return this.props.userId;
  }

  get entryDate() {
    return this.props.entryDate;
  }

  get mood() {
    return this.props.mood;
  }

  get symptoms() {
    return this.props.symptoms;
  }

  get symptomIntensity() {
    return this.props.symptomIntensity;
  }

  get medicationTaken() {
    return this.props.medicationTaken;
  }

  get dosage() {
    return this.props.dosage;
  }

  get sideEffects() {
    return this.props.sideEffects;
  }

  get notes() {
    return this.props.notes;
  }

  get visibility() {
    return this.props.visibility;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  update(patch: Partial<Omit<TreatmentJournalEntryProps, 'userId' | 'createdAt' | 'updatedAt'>>) {
    if (patch.entryDate !== undefined) this.props.entryDate = patch.entryDate;
    if (patch.mood !== undefined) this.props.mood = patch.mood;
    if (patch.symptoms !== undefined) this.props.symptoms = patch.symptoms;
    if (patch.symptomIntensity !== undefined)
      this.props.symptomIntensity = patch.symptomIntensity;
    if (patch.medicationTaken !== undefined)
      this.props.medicationTaken = patch.medicationTaken;
    if (patch.dosage !== undefined) this.props.dosage = patch.dosage;
    if (patch.sideEffects !== undefined)
      this.props.sideEffects = patch.sideEffects;
    if (patch.notes !== undefined) this.props.notes = patch.notes;
    if (patch.visibility !== undefined)
      this.props.visibility = patch.visibility;
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      TreatmentJournalEntryProps,
      | 'symptoms'
      | 'sideEffects'
      | 'medicationTaken'
      | 'visibility'
      | 'createdAt'
      | 'updatedAt'
    >,
    id?: UniqueEntityID,
  ) {
    return new TreatmentJournalEntry(
      {
        ...props,
        symptoms: props.symptoms ?? [],
        sideEffects: props.sideEffects ?? [],
        medicationTaken: props.medicationTaken ?? false,
        visibility: props.visibility ?? 'private',
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
