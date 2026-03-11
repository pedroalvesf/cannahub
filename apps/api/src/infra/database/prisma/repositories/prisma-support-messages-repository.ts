import { Injectable } from '@nestjs/common';
import { SupportMessagesRepository } from '@/domain/onboarding/application/repositories/support-messages-repository';
import { SupportMessage } from '@/domain/onboarding/enterprise/entities/support-message';
import { PrismaService } from '../prisma.service';
import { PrismaSupportMessageMapper } from '../mappers/prisma-support-message-mapper';

@Injectable()
export class PrismaSupportMessagesRepository
  implements SupportMessagesRepository
{
  constructor(private prisma: PrismaService) {}

  async findByTicketId(ticketId: string): Promise<SupportMessage[]> {
    const raw = await this.prisma.supportMessage.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    });

    return raw.map(PrismaSupportMessageMapper.toDomain);
  }

  async create(message: SupportMessage): Promise<void> {
    const data = PrismaSupportMessageMapper.toPrisma(message);

    await this.prisma.supportMessage.create({ data });
  }
}
