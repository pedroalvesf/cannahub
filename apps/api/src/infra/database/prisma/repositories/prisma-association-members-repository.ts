import { Injectable } from '@nestjs/common';
import { AssociationMembersRepository } from '@/domain/association/application/repositories/association-members-repository';
import { AssociationMember } from '@/domain/association/enterprise/entities/association-member';
import { PrismaService } from '../prisma.service';
import { PrismaAssociationMemberMapper } from '../mappers/prisma-association-member-mapper';

@Injectable()
export class PrismaAssociationMembersRepository
  implements AssociationMembersRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AssociationMember | null> {
    const member = await this.prisma.associationMember.findUnique({
      where: { id },
    });
    return member
      ? PrismaAssociationMemberMapper.toDomain(member)
      : null;
  }

  async findByAssociationId(
    associationId: string,
  ): Promise<AssociationMember[]> {
    const members = await this.prisma.associationMember.findMany({
      where: { associationId },
    });
    return members.map(PrismaAssociationMemberMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<AssociationMember[]> {
    const members = await this.prisma.associationMember.findMany({
      where: { userId },
    });
    return members.map(PrismaAssociationMemberMapper.toDomain);
  }

  async findByAssociationAndUser(
    associationId: string,
    userId: string,
  ): Promise<AssociationMember | null> {
    const member = await this.prisma.associationMember.findUnique({
      where: {
        associationId_userId: { associationId, userId },
      },
    });
    return member
      ? PrismaAssociationMemberMapper.toDomain(member)
      : null;
  }

  async create(member: AssociationMember): Promise<void> {
    const data = PrismaAssociationMemberMapper.toPrisma(member);
    await this.prisma.associationMember.create({ data });
  }

  async save(member: AssociationMember): Promise<void> {
    const data = PrismaAssociationMemberMapper.toPrismaUpdate(member);
    await this.prisma.associationMember.update({
      where: { id: member.id.toString() },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.associationMember.delete({ where: { id } });
  }
}
