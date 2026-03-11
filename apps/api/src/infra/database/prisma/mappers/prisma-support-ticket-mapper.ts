import {
  SupportTicket as PrismaSupportTicket,
  Prisma,
} from '@/generated/prisma/client';
import { SupportTicket } from '@/domain/onboarding/enterprise/entities/support-ticket';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaSupportTicketMapper {
  static toDomain(raw: PrismaSupportTicket): SupportTicket {
    return SupportTicket.create(
      {
        sessionId: new UniqueEntityID(raw.sessionId),
        status: raw.status,
        assignedTo: raw.assignedTo ?? undefined,
        context: raw.context as Record<string, unknown>,
        createdAt: raw.createdAt,
        closedAt: raw.closedAt ?? undefined,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaCreate(
    ticket: SupportTicket,
  ): Prisma.SupportTicketUncheckedCreateInput {
    return {
      id: ticket.id.toString(),
      sessionId: ticket.sessionId.toString(),
      status: ticket.status,
      assignedTo: ticket.assignedTo ?? null,
      context: ticket.context as unknown as Prisma.InputJsonValue,
      closedAt: ticket.closedAt ?? null,
    };
  }

  static toPrismaUpdate(
    ticket: SupportTicket,
  ): Prisma.SupportTicketUncheckedUpdateInput {
    return {
      status: ticket.status,
      assignedTo: ticket.assignedTo ?? null,
      closedAt: ticket.closedAt ?? null,
    };
  }
}
