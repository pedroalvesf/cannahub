import { Injectable } from '@nestjs/common';
import { SupportTicketsRepository } from '@/domain/onboarding/application/repositories/support-tickets-repository';
import { SupportTicket } from '@/domain/onboarding/enterprise/entities/support-ticket';
import { PrismaService } from '../prisma.service';
import { PrismaSupportTicketMapper } from '../mappers/prisma-support-ticket-mapper';

@Injectable()
export class PrismaSupportTicketsRepository
  implements SupportTicketsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<SupportTicket | null> {
    const raw = await this.prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!raw) return null;

    return PrismaSupportTicketMapper.toDomain(raw);
  }

  async findBySessionId(sessionId: string): Promise<SupportTicket[]> {
    const raw = await this.prisma.supportTicket.findMany({
      where: { sessionId },
    });

    return raw.map(PrismaSupportTicketMapper.toDomain);
  }

  async findOpenTickets(): Promise<SupportTicket[]> {
    const raw = await this.prisma.supportTicket.findMany({
      where: { status: 'open' },
      orderBy: { createdAt: 'asc' },
    });

    return raw.map(PrismaSupportTicketMapper.toDomain);
  }

  async create(ticket: SupportTicket): Promise<void> {
    const data = PrismaSupportTicketMapper.toPrismaCreate(ticket);

    await this.prisma.supportTicket.create({ data });
  }

  async save(ticket: SupportTicket): Promise<void> {
    const data = PrismaSupportTicketMapper.toPrismaUpdate(ticket);

    await this.prisma.supportTicket.update({
      where: { id: ticket.id.toString() },
      data,
    });
  }
}
