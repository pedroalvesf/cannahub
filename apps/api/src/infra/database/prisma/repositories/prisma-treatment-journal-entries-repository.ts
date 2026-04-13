import { Injectable } from '@nestjs/common';
import { TreatmentJournalEntriesRepository } from '@/domain/patient/application/repositories/treatment-journal-entries-repository';
import {
  JournalVisibility,
  TreatmentJournalEntry,
} from '@/domain/patient/enterprise/entities/treatment-journal-entry';
import { PrismaService } from '../prisma.service';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type Row = {
  id: string;
  userId: string;
  entryDate: Date;
  mood: number | null;
  symptoms: string[];
  symptomIntensity: number | null;
  medicationTaken: boolean;
  dosage: string | null;
  sideEffects: string[];
  notes: string | null;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
};

function toDomain(r: Row): TreatmentJournalEntry {
  return TreatmentJournalEntry.create(
    {
      userId: new UniqueEntityID(r.userId),
      entryDate: r.entryDate,
      mood: r.mood ?? undefined,
      symptoms: r.symptoms,
      symptomIntensity: r.symptomIntensity ?? undefined,
      medicationTaken: r.medicationTaken,
      dosage: r.dosage ?? undefined,
      sideEffects: r.sideEffects,
      notes: r.notes ?? undefined,
      visibility: r.visibility as JournalVisibility,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    },
    new UniqueEntityID(r.id),
  );
}

@Injectable()
export class PrismaTreatmentJournalEntriesRepository
  implements TreatmentJournalEntriesRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<TreatmentJournalEntry | null> {
    const raw = await this.prisma.treatmentJournalEntry.findUnique({
      where: { id },
    });
    return raw ? toDomain(raw) : null;
  }

  async findByUserId(userId: string): Promise<TreatmentJournalEntry[]> {
    const raw = await this.prisma.treatmentJournalEntry.findMany({
      where: { userId },
      orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
    });
    return raw.map(toDomain);
  }

  async create(entry: TreatmentJournalEntry): Promise<void> {
    await this.prisma.treatmentJournalEntry.create({
      data: {
        id: entry.id.toString(),
        userId: entry.userId.toString(),
        entryDate: entry.entryDate,
        mood: entry.mood ?? null,
        symptoms: entry.symptoms,
        symptomIntensity: entry.symptomIntensity ?? null,
        medicationTaken: entry.medicationTaken,
        dosage: entry.dosage ?? null,
        sideEffects: entry.sideEffects,
        notes: entry.notes ?? null,
        visibility: entry.visibility,
      },
    });
  }

  async save(entry: TreatmentJournalEntry): Promise<void> {
    await this.prisma.treatmentJournalEntry.update({
      where: { id: entry.id.toString() },
      data: {
        entryDate: entry.entryDate,
        mood: entry.mood ?? null,
        symptoms: entry.symptoms,
        symptomIntensity: entry.symptomIntensity ?? null,
        medicationTaken: entry.medicationTaken,
        dosage: entry.dosage ?? null,
        sideEffects: entry.sideEffects,
        notes: entry.notes ?? null,
        visibility: entry.visibility,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.treatmentJournalEntry.delete({ where: { id } });
  }
}
