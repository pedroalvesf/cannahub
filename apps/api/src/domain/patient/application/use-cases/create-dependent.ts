import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Dependent } from '@/domain/patient/enterprise/entities/dependent';
import { DependentsRepository } from '../repositories/dependents-repository';
import { InvalidDependentError } from './errors/invalid-dependent-error';

// Mirrors @cannahub/shared RelationshipType. Inlined as literals to avoid a
// runtime import of the shared package's TS enum (see patient-association-link).
export const VALID_RELATIONSHIP_TYPES = [
  'parent',
  'legal_guardian',
  'caregiver',
  'spouse',
];

interface CreateDependentRequest {
  guardianUserId: string;
  name: string;
  birthDate?: string;
  documentNumber?: string;
  relationshipType: string;
}

type CreateDependentResponse = Either<
  InvalidDependentError,
  { dependent: Dependent }
>;

@Injectable()
export class CreateDependentUseCase {
  constructor(private dependentsRepository: DependentsRepository) {}

  async execute(
    request: CreateDependentRequest,
  ): Promise<CreateDependentResponse> {
    const name = request.name?.trim();

    if (!name) {
      return left(
        new InvalidDependentError('O nome do dependente é obrigatório.'),
      );
    }

    if (!VALID_RELATIONSHIP_TYPES.includes(request.relationshipType)) {
      return left(new InvalidDependentError('Tipo de vínculo inválido.'));
    }

    let birthDate: Date | undefined;
    if (request.birthDate) {
      const parsed = new Date(request.birthDate);
      if (Number.isNaN(parsed.getTime())) {
        return left(
          new InvalidDependentError('Data de nascimento inválida.'),
        );
      }
      birthDate = parsed;
    }

    const dependent = Dependent.create({
      guardianUserId: new UniqueEntityID(request.guardianUserId),
      name,
      birthDate,
      documentNumber: request.documentNumber?.trim() || undefined,
      relationshipType: request.relationshipType,
    });

    await this.dependentsRepository.create(dependent);

    return right({ dependent });
  }
}
