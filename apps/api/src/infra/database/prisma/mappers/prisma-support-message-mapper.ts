import { SupportMessage as PrismaSupportMessage } from '@/generated/prisma/client';
import { SupportMessage } from '@/domain/onboarding/enterprise/entities/support-message';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaSupportMessageMapper {
  static toDomain(raw: PrismaSupportMessage): SupportMessage {
    return SupportMessage.create(
      {
        ticketId: new UniqueEntityID(raw.ticketId),
        sender: raw.sender,
        content: raw.content,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(message: SupportMessage) {
    return {
      id: message.id.toString(),
      ticketId: message.ticketId.toString(),
      sender: message.sender,
      content: message.content,
    };
  }
}
