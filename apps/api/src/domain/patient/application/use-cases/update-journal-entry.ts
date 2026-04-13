import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { TreatmentJournalEntriesRepository } from '../repositories/treatment-journal-entries-repository';
import {
  JournalVisibility,
  TreatmentJournalEntry,
} from '../../enterprise/entities/treatment-journal-entry';
import { JournalEntryNotFoundError } from './errors/journal-entry-not-found-error';
import { NotEntryOwnerError } from './errors/not-entry-owner-error';

interface UpdateJournalEntryRequest {
  entryId: string;
  userId: string;
  entryDate?: Date;
  mood?: number;
  symptoms?: string[];
  symptomIntensity?: number;
  medicationTaken?: boolean;
  dosage?: string;
  sideEffects?: string[];
  notes?: string;
  visibility?: JournalVisibility;
}

type UpdateJournalEntryResponse = Either<
  JournalEntryNotFoundError | NotEntryOwnerError,
  { entry: TreatmentJournalEntry }
>;

@Injectable()
export class UpdateJournalEntryUseCase {
  constructor(
    private entriesRepository: TreatmentJournalEntriesRepository,
  ) {}

  async execute(
    request: UpdateJournalEntryRequest,
  ): Promise<UpdateJournalEntryResponse> {
    const entry = await this.entriesRepository.findById(request.entryId);
    if (!entry) return left(new JournalEntryNotFoundError());
    if (entry.userId.toString() !== request.userId) {
      return left(new NotEntryOwnerError());
    }

    entry.update({
      entryDate: request.entryDate,
      mood: request.mood,
      symptoms: request.symptoms,
      symptomIntensity: request.symptomIntensity,
      medicationTaken: request.medicationTaken,
      dosage: request.dosage,
      sideEffects: request.sideEffects,
      notes: request.notes,
      visibility: request.visibility,
    });

    await this.entriesRepository.save(entry);
    return right({ entry });
  }
}
