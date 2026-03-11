import { SupportMessage } from '../../enterprise/entities/support-message';

export abstract class SupportMessagesRepository {
  abstract findByTicketId(ticketId: string): Promise<SupportMessage[]>;
  abstract create(message: SupportMessage): Promise<void>;
}
