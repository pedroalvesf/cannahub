import { GetUserAssociationUseCase } from '../get-user-association';
import { InMemoryAssociationMembersRepository } from '@/test/repositories/in-memory-association-members-repository';
import { makeAssociationMember } from '@/test/factories/make-association-member';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAnAssociationMemberError } from '../errors/not-association-member-error';

let membersRepository: InMemoryAssociationMembersRepository;
let sut: GetUserAssociationUseCase;

describe('GetUserAssociationUseCase', () => {
  beforeEach(() => {
    membersRepository = new InMemoryAssociationMembersRepository();
    sut = new GetUserAssociationUseCase(membersRepository);
  });

  it('should return associationId and role for an active member', async () => {
    const userId = new UniqueEntityID();
    const associationId = new UniqueEntityID();

    const member = makeAssociationMember({
      userId,
      associationId,
      role: 'director',
      status: 'active',
    });

    membersRepository.items.push(member);

    const result = await sut.execute({ userId: userId.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.associationId).toBe(associationId.toString());
      expect(result.value.memberRole).toBe('director');
    }
  });

  it('should return error if user has no active membership', async () => {
    const userId = new UniqueEntityID();

    const member = makeAssociationMember({
      userId,
      status: 'inactive',
    });

    membersRepository.items.push(member);

    const result = await sut.execute({ userId: userId.toString() });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAnAssociationMemberError);
  });

  it('should return error if user has no membership at all', async () => {
    const result = await sut.execute({ userId: 'non-existent-user' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAnAssociationMemberError);
  });
});
