import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CreateJournalEntryUseCase } from '@/domain/patient/application/use-cases/create-journal-entry';
import { ListJournalEntriesUseCase } from '@/domain/patient/application/use-cases/list-journal-entries';
import { UpdateJournalEntryUseCase } from '@/domain/patient/application/use-cases/update-journal-entry';
import { DeleteJournalEntryUseCase } from '@/domain/patient/application/use-cases/delete-journal-entry';
import { TreatmentJournalEntry } from '@/domain/patient/enterprise/entities/treatment-journal-entry';
import { JournalEntryNotFoundError } from '@/domain/patient/application/use-cases/errors/journal-entry-not-found-error';
import { NotEntryOwnerError } from '@/domain/patient/application/use-cases/errors/not-entry-owner-error';

const visibilitySchema = z.enum(['private', 'shareable']);

const createBodySchema = z.object({
  entryDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  mood: z.number().int().min(1).max(5).optional(),
  symptoms: z.array(z.string()).optional(),
  symptomIntensity: z.number().int().min(0).max(10).optional(),
  medicationTaken: z.boolean().optional(),
  dosage: z.string().optional(),
  sideEffects: z.array(z.string()).optional(),
  notes: z.string().optional(),
  visibility: visibilitySchema.optional(),
});

const updateBodySchema = createBodySchema.partial();

function toJson(e: TreatmentJournalEntry) {
  return {
    id: e.id.toString(),
    entryDate: e.entryDate.toISOString().slice(0, 10),
    mood: e.mood ?? null,
    symptoms: e.symptoms,
    symptomIntensity: e.symptomIntensity ?? null,
    medicationTaken: e.medicationTaken,
    dosage: e.dosage ?? null,
    sideEffects: e.sideEffects,
    notes: e.notes ?? null,
    visibility: e.visibility,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(
    private createEntry: CreateJournalEntryUseCase,
    private listEntries: ListJournalEntriesUseCase,
    private updateEntry: UpdateJournalEntryUseCase,
    private deleteEntry: DeleteJournalEntryUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async list(@CurrentUser() user: UserPayload) {
    const result = await this.listEntries.execute(user.sub);
    return { entries: result.value.entries.map(toJson) };
  }

  @Post()
  @HttpCode(201)
  async create(
    @CurrentUser() user: UserPayload,
    @Body() rawBody: unknown,
  ) {
    const parsed = createBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Dados inválidos.',
        issues: parsed.error.issues,
      });
    }

    const result = await this.createEntry.execute({
      userId: user.sub,
      ...parsed.data,
      entryDate: new Date(parsed.data.entryDate),
    });

    return { entry: toJson(result.value.entry) };
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() rawBody: unknown,
  ) {
    const parsed = updateBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Dados inválidos.',
        issues: parsed.error.issues,
      });
    }

    const result = await this.updateEntry.execute({
      entryId: id,
      userId: user.sub,
      ...parsed.data,
      entryDate: parsed.data.entryDate
        ? new Date(parsed.data.entryDate)
        : undefined,
    });

    if (result.isLeft()) {
      const err = result.value;
      if (err instanceof JournalEntryNotFoundError) {
        throw new NotFoundException(err.message);
      }
      if (err instanceof NotEntryOwnerError) {
        throw new NotFoundException('Entrada do diário não encontrada.');
      }
      throw new BadRequestException();
    }

    return { entry: toJson(result.value.entry) };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    const result = await this.deleteEntry.execute({
      entryId: id,
      userId: user.sub,
    });

    if (result.isLeft()) {
      throw new NotFoundException('Entrada do diário não encontrada.');
    }
  }
}
