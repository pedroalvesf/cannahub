import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import {
  DoctorsRepository,
  ListDirectoryFilters,
} from '../repositories/doctors-repository';
import { Doctor } from '../../enterprise/entities/doctor';

type ListDirectoryDoctorsResponse = Either<never, { doctors: Doctor[] }>;

@Injectable()
export class ListDirectoryDoctorsUseCase {
  constructor(private doctorsRepository: DoctorsRepository) {}

  async execute(filters: ListDirectoryFilters): Promise<ListDirectoryDoctorsResponse> {
    const doctors = await this.doctorsRepository.listForDirectory(filters);
    return right({ doctors });
  }
}
