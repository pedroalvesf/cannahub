import { Address } from '../../enterprise/entities/address';

export abstract class AddressesRepository {
  abstract findByUserId(userId: string): Promise<Address | null>;
  abstract save(address: Address): Promise<void>;
}
