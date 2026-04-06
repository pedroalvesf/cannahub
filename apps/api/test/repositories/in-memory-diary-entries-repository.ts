import {
  DiaryEntriesRepository,
  FindManyDiaryEntriesParams,
} from '@/domain/diary/application/repositories/diary-entries-repository'
import { DiaryEntry } from '@/domain/diary/enterprise/entities/diary-entry'

export class InMemoryDiaryEntriesRepository implements DiaryEntriesRepository {
  public items: DiaryEntry[] = []

  async create(entry: DiaryEntry): Promise<void> {
    this.items.push(entry)
  }

  async findById(id: string): Promise<DiaryEntry | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findManyByUserId(
    params: FindManyDiaryEntriesParams,
  ): Promise<{ entries: DiaryEntry[]; total: number }> {
    let result = this.items.filter(
      (item) => item.userId.toString() === params.userId,
    )

    if (params.dateFrom) {
      result = result.filter((item) => item.date >= params.dateFrom!)
    }
    if (params.dateTo) {
      result = result.filter((item) => item.date <= params.dateTo!)
    }
    if (params.productId) {
      result = result.filter(
        (item) => item.productId?.toString() === params.productId,
      )
    }
    if (params.administrationMethod) {
      result = result.filter(
        (item) => item.administrationMethod === params.administrationMethod,
      )
    }
    if (params.symptomKey) {
      result = result.filter((item) =>
        item.symptoms.some((s) => s.symptomKey === params.symptomKey),
      )
    }

    result.sort((a, b) => {
      const dateDiff = b.date.getTime() - a.date.getTime()
      if (dateDiff !== 0) return dateDiff
      return b.time.localeCompare(a.time)
    })

    const total = result.length
    const start = (params.page - 1) * params.perPage
    const entries = result.slice(start, start + params.perPage)

    return { entries, total }
  }

  async update(entry: DiaryEntry): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(entry.id))
    if (index >= 0) {
      this.items[index] = entry
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toString() !== id)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((item) => item.userId.toString() === userId).length
  }
}
