import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddressesRepository } from '@/domain/auth/application/repositories/addresses-repository';
import { Address } from '@/domain/auth/enterprise/entities/address';
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper';

@Injectable()
export class PrismaAddressesRepository implements AddressesRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: { userId },
    });

    if (!address) return null;

    return PrismaAddressMapper.toDomain(address);
  }

  async save(address: Address): Promise<void> {
    const existing = await this.prisma.address.findUnique({
      where: { userId: address.userId.toString() },
    });

    if (existing) {
      await this.prisma.address.update({
        where: { userId: address.userId.toString() },
        data: PrismaAddressMapper.toPrismaUpdate(address),
      });
    } else {
      await this.prisma.address.create({
        data: PrismaAddressMapper.toPrismaCreate(address),
      });
    }
  }
}
