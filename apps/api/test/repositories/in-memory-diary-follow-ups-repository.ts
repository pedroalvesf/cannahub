import { DiaryFollowUpsRepository } from '@/domain/diary/application/repositories/diary-follow-ups-repository'
import { DiaryFollowUp } from '@/domain/diary/enterprise/entities/diary-follow-up'

export class InMemoryDiaryFollowUpsRepository
  implements DiaryFollowUpsRepository
{
  public items: DiaryFollowUp[] = []

  async create(followUp: DiaryFollowUp): Promise<void> {
    this.items.push(followUp)
  }

  async findById(id: string): Promise<DiaryFollowUp | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findManyByEntryId(entryId: string): Promise<DiaryFollowUp[]> {
    return this.items
      .filter((item) => item.diaryEntryId.toString() === entryId)
      .sort((a, b) => a.evaluatedAt.getTime() - b.evaluatedAt.getTime())
  }

  async update(followUp: DiaryFollowUp): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(followUp.id))
    if (index >= 0) {
      this.items[index] = followUp
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toString() !== id)
  }
}
