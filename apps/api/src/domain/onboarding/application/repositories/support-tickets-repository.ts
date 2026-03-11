import { SupportTicket } from '../../enterprise/entities/support-ticket';

export abstract class SupportTicketsRepository {
  abstract findById(id: string): Promise<SupportTicket | null>;
  abstract findBySessionId(sessionId: string): Promise<SupportTicket[]>;
  abstract findOpenTickets(): Promise<SupportTicket[]>;
  abstract create(ticket: SupportTicket): Promise<void>;
  abstract save(ticket: SupportTicket): Promise<void>;
}
