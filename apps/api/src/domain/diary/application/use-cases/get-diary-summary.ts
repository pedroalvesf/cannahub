import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { DiaryEntriesRepository } from '../repositories/diary-entries-repository'

interface GetDiarySummaryRequest {
  userId: string
  dateFrom?: Date
  dateTo?: Date
}

interface SymptomDelta {
  symptomKey: string
  avgSeverityBefore: number
  avgSeverityAfter: number | null
}

interface GetDiarySummaryResult {
  totalEntries: number
  mostFrequentSymptoms: Array<{ symptomKey: string; count: number }>
  mostUsedProduct: { name: string; count: number } | null
  symptomDeltas: SymptomDelta[]
  methodDistribution: Record<string, number>
}

type GetDiarySummaryResponse = Either<never, GetDiarySummaryResult>

const SEVERITY_MAP: Record<string, number> = {
  none: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
}

@Injectable()
export class GetDiarySummaryUseCase {
  constructor(private diaryEntriesRepository: DiaryEntriesRepository) {}

  async execute(
    request: GetDiarySummaryRequest,
  ): Promise<GetDiarySummaryResponse> {
    const now = new Date()
    const dateFrom =
      request.dateFrom ?? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const dateTo = request.dateTo ?? now

    const { entries } = await this.diaryEntriesRepository.findManyByUserId({
      userId: request.userId,
      page: 1,
      perPage: 10000,
      dateFrom,
      dateTo,
    })

    const totalEntries = entries.length

    if (totalEntries === 0) {
      return right({
        totalEntries: 0,
        mostFrequentSymptoms: [],
        mostUsedProduct: null,
        symptomDeltas: [],
        methodDistribution: {},
      })
    }

    // Most frequent symptoms (top 5)
    const symptomCounts = new Map<string, number>()
    for (const entry of entries) {
      for (const symptom of entry.symptoms) {
        const count = symptomCounts.get(symptom.symptomKey) ?? 0
        symptomCounts.set(symptom.symptomKey, count + 1)
      }
    }
    const mostFrequentSymptoms = [...symptomCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([symptomKey, count]) => ({ symptomKey, count }))

    // Most used product
    const productCounts = new Map<string, number>()
    for (const entry of entries) {
      const name = entry.customProductName ?? entry.productId?.toString()
      if (name) {
        const count = productCounts.get(name) ?? 0
        productCounts.set(name, count + 1)
      }
    }
    let mostUsedProduct: { name: string; count: number } | null = null
    for (const [name, count] of productCounts.entries()) {
      if (!mostUsedProduct || count > mostUsedProduct.count) {
        mostUsedProduct = { name, count }
      }
    }

    // Symptom deltas (avg before vs after)
    const symptomData = new Map<
      string,
      { beforeSum: number; beforeCount: number; afterSum: number; afterCount: number }
    >()
    for (const entry of entries) {
      for (const symptom of entry.symptoms) {
        const data = symptomData.get(symptom.symptomKey) ?? {
          beforeSum: 0,
          beforeCount: 0,
          afterSum: 0,
          afterCount: 0,
        }
        const beforeVal = SEVERITY_MAP[symptom.severityBefore] ?? 0
        data.beforeSum += beforeVal
        data.beforeCount += 1
        if (symptom.severityAfter) {
          const afterVal = SEVERITY_MAP[symptom.severityAfter] ?? 0
          data.afterSum += afterVal
          data.afterCount += 1
        }
        symptomData.set(symptom.symptomKey, data)
      }
    }
    const symptomDeltas: SymptomDelta[] = [...symptomData.entries()].map(
      ([symptomKey, data]) => ({
        symptomKey,
        avgSeverityBefore: data.beforeCount > 0 ? data.beforeSum / data.beforeCount : 0,
        avgSeverityAfter:
          data.afterCount > 0 ? data.afterSum / data.afterCount : null,
      }),
    )

    // Method distribution
    const methodDistribution: Record<string, number> = {}
    for (const entry of entries) {
      methodDistribution[entry.administrationMethod] =
        (methodDistribution[entry.administrationMethod] ?? 0) + 1
    }

    return right({
      totalEntries,
      mostFrequentSymptoms,
      mostUsedProduct,
      symptomDeltas,
      methodDistribution,
    })
  }
}
