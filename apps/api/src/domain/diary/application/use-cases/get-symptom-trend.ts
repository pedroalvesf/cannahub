import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { DiaryEntriesRepository } from '../repositories/diary-entries-repository'

interface GetSymptomTrendRequest {
  userId: string
  symptomKey: string
  dateFrom: Date
  dateTo: Date
}

interface TrendDataPoint {
  date: string
  avgSeverityBefore: number
  avgSeverityAfter: number | null
  entryCount: number
}

type GetSymptomTrendResponse = Either<never, { dataPoints: TrendDataPoint[] }>

@Injectable()
export class GetSymptomTrendUseCase {
  constructor(private diaryEntriesRepository: DiaryEntriesRepository) {}

  async execute(
    request: GetSymptomTrendRequest,
  ): Promise<GetSymptomTrendResponse> {
    const { entries } = await this.diaryEntriesRepository.findManyByUserId({
      userId: request.userId,
      page: 1,
      perPage: 10000,
      dateFrom: request.dateFrom,
      dateTo: request.dateTo,
      symptomKey: request.symptomKey,
    })

    const dayMap = new Map<
      string,
      { beforeSum: number; beforeCount: number; afterSum: number; afterCount: number; entryCount: number }
    >()

    for (const entry of entries) {
      const dateKey = entry.date.toISOString().split('T')[0]!
      const data = dayMap.get(dateKey) ?? {
        beforeSum: 0,
        beforeCount: 0,
        afterSum: 0,
        afterCount: 0,
        entryCount: 0,
      }

      const matchingSymptoms = entry.symptoms.filter(
        (s) => s.symptomKey === request.symptomKey,
      )
      for (const symptom of matchingSymptoms) {
        data.beforeSum += symptom.severityBefore
        data.beforeCount += 1

        // Pega o último follow-up que avaliou este sintoma específico
        const latestFollowUp = [...entry.followUps]
          .sort((a, b) => b.evaluatedAt.getTime() - a.evaluatedAt.getTime())
          .find((f) =>
            f.symptomAssessments.some(
              (a) => a.symptomLogId.toString() === symptom.id.toString(),
            ),
          )

        if (latestFollowUp) {
          const assessment = latestFollowUp.symptomAssessments.find(
            (a) => a.symptomLogId.toString() === symptom.id.toString(),
          )
          if (assessment) {
            data.afterSum += assessment.severityAfter
            data.afterCount += 1
          }
        }
      }

      if (matchingSymptoms.length > 0) data.entryCount += 1
      dayMap.set(dateKey, data)
    }

    const dataPoints: TrendDataPoint[] = [...dayMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({
        date,
        avgSeverityBefore:
          data.beforeCount > 0 ? data.beforeSum / data.beforeCount : 0,
        avgSeverityAfter:
          data.afterCount > 0 ? data.afterSum / data.afterCount : null,
        entryCount: data.entryCount,
      }))

    return right({ dataPoints })
  }
}
