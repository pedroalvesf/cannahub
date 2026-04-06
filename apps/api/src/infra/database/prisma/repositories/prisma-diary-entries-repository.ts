import { Injectable } from '@nestjs/common'
import { Prisma } from '@/generated/prisma/client'
import { PrismaService } from '../prisma.service'
import {
  DiaryEntriesRepository,
  FindManyDiaryEntriesParams,
} from '@/domain/diary/application/repositories/diary-entries-repository'
import { DiaryEntry } from '@/domain/diary/enterprise/entities/diary-entry'
import { PrismaDiaryEntryMapper } from '../mappers/prisma-diary-entry-mapper'

const INCLUDE_RELATIONS = {
  Symptoms: true,
  Effects: true,
} as const

@Injectable()
export class PrismaDiaryEntriesRepository implements DiaryEntriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(entry: DiaryEntry): Promise<void> {
    const data = PrismaDiaryEntryMapper.toPrismaCreate(entry)
    await this.prisma.diaryEntry.create({ data })
  }

  async findById(id: string): Promise<DiaryEntry | null> {
    const raw = await this.prisma.diaryEntry.findUnique({
      where: { id },
      include: INCLUDE_RELATIONS,
    })

    return raw ? PrismaDiaryEntryMapper.toDomain(raw) : null
  }

  async findManyByUserId(
    params: FindManyDiaryEntriesParams,
  ): Promise<{ entries: DiaryEntry[]; total: number }> {
    const where: Prisma.DiaryEntryWhereInput = {
      userId: params.userId,
    }

    if (params.dateFrom || params.dateTo) {
      where.date = {}
      if (params.dateFrom) where.date.gte = params.dateFrom
      if (params.dateTo) where.date.lte = params.dateTo
    }
    if (params.productId) {
      where.productId = params.productId
    }
    if (params.administrationMethod) {
      where.administrationMethod = params.administrationMethod
    }
    if (params.symptomKey) {
      where.Symptoms = { some: { symptomKey: params.symptomKey } }
    }

    const [entries, total] = await Promise.all([
      this.prisma.diaryEntry.findMany({
        where,
        include: INCLUDE_RELATIONS,
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
      }),
      this.prisma.diaryEntry.count({ where }),
    ])

    return {
      entries: entries.map(PrismaDiaryEntryMapper.toDomain),
      total,
    }
  }

  async update(entry: DiaryEntry): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.diaryEntry.update({
        where: { id: entry.id.toString() },
        data: {
          date: entry.date,
          time: entry.time,
          productId: entry.productId?.toString() ?? null,
          customProductName: entry.customProductName ?? null,
          administrationMethod: entry.administrationMethod,
          doseAmount: entry.doseAmount,
          doseUnit: entry.doseUnit,
          notes: entry.notes ?? null,
          isFavorite: entry.isFavorite,
          updatedAt: entry.updatedAt,
        },
      })

      // Update symptom severityAfter values
      for (const symptom of entry.symptoms) {
        if (symptom.severityAfter !== undefined) {
          await tx.diarySymptomLog.update({
            where: { id: symptom.id.toString() },
            data: { severityAfter: symptom.severityAfter },
          })
        }
      }
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.diaryEntry.delete({ where: { id } })
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.diaryEntry.count({ where: { userId } })
  }
}
