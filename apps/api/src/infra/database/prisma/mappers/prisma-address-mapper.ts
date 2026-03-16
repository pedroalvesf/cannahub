import { Address as PrismaAddress, Prisma } from '@/generated/prisma/client';
import { Address } from '@/domain/auth/enterprise/entities/address';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.create(
      {
        userId: new UniqueEntityID(raw.userId),
        street: raw.street,
        complement: raw.complement ?? undefined,
        neighborhood: raw.neighborhood,
        city: raw.city,
        state: raw.state,
        zipCode: raw.zipCode,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaCreate(address: Address): Prisma.AddressCreateInput {
    return {
      id: address.id.toString(),
      street: address.street,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
      User: { connect: { id: address.userId.toString() } },
    };
  }

  static toPrismaUpdate(
    address: Address,
  ): Prisma.AddressUpdateInput {
    return {
      street: address.street,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      updatedAt: address.updatedAt,
    };
  }
}
