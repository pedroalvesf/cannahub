import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DoctorsRepository } from '../repositories/doctors-repository';
import { Doctor } from '../../enterprise/entities/doctor';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

type GetDoctorBySlugResponse = Either<ResourceNotFoundError, { doctor: Doctor }>;

@Injectable()
export class GetDoctorBySlugUseCase {
  constructor(private doctorsRepository: DoctorsRepository) {}

  async execute(slug: string): Promise<GetDoctorBySlugResponse> {
    const doctor = await this.doctorsRepository.findBySlug(slug);
    if (!doctor || !doctor.active || !doctor.directoryListed) {
      return left(new ResourceNotFoundError());
    }
    return right({ doctor });
  }
}
