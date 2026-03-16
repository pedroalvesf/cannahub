import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Address } from '../../enterprise/entities/address';
import { AddressesRepository } from '../repositories/addresses-repository';

interface GetAddressRequest {
  userId: string;
}

type GetAddressResponse = Either<never, { address: Address | null }>;

@Injectable()
export class GetAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({
    userId,
  }: GetAddressRequest): Promise<GetAddressResponse> {
    const address = await this.addressesRepository.findByUserId(userId);
    return right({ address });
  }
}
