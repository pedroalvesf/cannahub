import { AssociationMembersRepository } from '@/domain/association/application/repositories/association-members-repository';
import { AssociationMember } from '@/domain/association/enterprise/entities/association-member';

export class InMemoryAssociationMembersRepository
  implements AssociationMembersRepository
{
  public items: AssociationMember[] = [];

  async findById(id: string): Promise<AssociationMember | null> {
    const item = this.items.find((i) => i.id.toString() === id);
    return item ?? null;
  }

  async findByAssociationId(
    associationId: string,
  ): Promise<AssociationMember[]> {
    return this.items.filter(
      (i) => i.associationId.toString() === associationId,
    );
  }

  async findByUserId(userId: string): Promise<AssociationMember[]> {
    return this.items.filter((i) => i.userId.toString() === userId);
  }

  async findByAssociationAndUser(
    associationId: string,
    userId: string,
  ): Promise<AssociationMember | null> {
    const item = this.items.find(
      (i) =>
        i.associationId.toString() === associationId &&
        i.userId.toString() === userId,
    );
    return item ?? null;
  }

  async create(member: AssociationMember): Promise<void> {
    this.items.push(member);
  }

  async save(member: AssociationMember): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === member.id.toString(),
    );
    if (index >= 0) {
      this.items[index] = member;
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((i) => i.id.toString() === id);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
