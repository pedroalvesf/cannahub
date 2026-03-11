import { SupportTicketsRepository } from '@/domain/onboarding/application/repositories/support-tickets-repository';
import { SupportTicket } from '@/domain/onboarding/enterprise/entities/support-ticket';

export class InMemorySupportTicketsRepository
  implements SupportTicketsRepository
{
  public items: SupportTicket[] = [];

  async findById(id: string): Promise<SupportTicket | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null;
  }

  async findBySessionId(sessionId: string): Promise<SupportTicket[]> {
    return this.items.filter(
      (item) => item.sessionId.toString() === sessionId,
    );
  }

  async findOpenTickets(): Promise<SupportTicket[]> {
    return this.items.filter((item) => item.status === 'open');
  }

  async create(ticket: SupportTicket): Promise<void> {
    this.items.push(ticket);
  }

  async save(ticket: SupportTicket): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === ticket.id.toString(),
    );
    if (index >= 0) {
      this.items[index] = ticket;
    }
  }
}
