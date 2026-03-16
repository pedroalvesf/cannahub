import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Address } from '../../enterprise/entities/address';
import { AddressesRepository } from '../repositories/addresses-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface SaveAddressRequest {
  userId: string;
  street: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

type SaveAddressResponse = Either<never, { address: Address }>;

@Injectable()
export class SaveAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute(request: SaveAddressRequest): Promise<SaveAddressResponse> {
    const existing = await this.addressesRepository.findByUserId(
      request.userId,
    );

    if (existing) {
      // Update
      existing.street = request.street;
      existing.complement = request.complement;
      existing.neighborhood = request.neighborhood;
      existing.city = request.city;
      existing.state = request.state;
      existing.zipCode = request.zipCode;

      await this.addressesRepository.save(existing);
      return right({ address: existing });
    }

    // Create
    const address = Address.create({
      userId: new UniqueEntityID(request.userId),
      street: request.street,
      complement: request.complement,
      neighborhood: request.neighborhood,
      city: request.city,
      state: request.state,
      zipCode: request.zipCode,
    });

    await this.addressesRepository.save(address);
    return right({ address });
  }
}
