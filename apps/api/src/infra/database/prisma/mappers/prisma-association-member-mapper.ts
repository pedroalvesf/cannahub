import {
  AssociationMember as PrismaAssociationMember,
  Prisma,
} from '@/generated/prisma/client';
import {
  AssociationMember,
  AssociationMemberRoleValue,
  AssociationMemberStatusValue,
} from '@/domain/association/enterprise/entities/association-member';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaAssociationMemberMapper {
  static toDomain(raw: PrismaAssociationMember): AssociationMember {
    return AssociationMember.create(
      {
        associationId: new UniqueEntityID(raw.associationId),
        userId: new UniqueEntityID(raw.userId),
        role: raw.role as AssociationMemberRoleValue,
        status: raw.status as AssociationMemberStatusValue,
        assignedAt: raw.assignedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    member: AssociationMember,
  ): Prisma.AssociationMemberUncheckedCreateInput {
    return {
      id: member.id.toString(),
      associationId: member.associationId.toString(),
      userId: member.userId.toString(),
      role: member.role,
      status: member.status,
      assignedAt: member.assignedAt,
    };
  }

  static toPrismaUpdate(
    member: AssociationMember,
  ): Prisma.AssociationMemberUncheckedUpdateInput {
    return {
      role: member.role,
      status: member.status,
    };
  }
}
