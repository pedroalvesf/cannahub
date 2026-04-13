import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { TreatmentJournalEntriesRepository } from '../repositories/treatment-journal-entries-repository';
import {
  JournalVisibility,
  TreatmentJournalEntry,
} from '../../enterprise/entities/treatment-journal-entry';

interface CreateJournalEntryRequest {
  userId: string;
  entryDate: Date;
  mood?: number;
  symptoms?: string[];
  symptomIntensity?: number;
  medicationTaken?: boolean;
  dosage?: string;
  sideEffects?: string[];
  notes?: string;
  visibility?: JournalVisibility;
}

type CreateJournalEntryResponse = Either<
  never,
  { entry: TreatmentJournalEntry }
>;

@Injectable()
export class CreateJournalEntryUseCase {
  constructor(
    private entriesRepository: TreatmentJournalEntriesRepository,
  ) {}

  async execute(
    request: CreateJournalEntryRequest,
  ): Promise<CreateJournalEntryResponse> {
    const entry = TreatmentJournalEntry.create({
      userId: new UniqueEntityID(request.userId),
      entryDate: request.entryDate,
      mood: request.mood,
      symptoms: request.symptoms ?? [],
      symptomIntensity: request.symptomIntensity,
      medicationTaken: request.medicationTaken ?? false,
      dosage: request.dosage,
      sideEffects: request.sideEffects ?? [],
      notes: request.notes,
      visibility: request.visibility ?? 'private',
    });

    await this.entriesRepository.create(entry);
    return right({ entry });
  }
}
