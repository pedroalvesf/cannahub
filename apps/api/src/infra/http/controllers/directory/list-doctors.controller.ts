import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { ListDirectoryDoctorsUseCase } from '@/domain/onboarding/application/use-cases/list-directory-doctors';
import { Doctor } from '@/domain/onboarding/enterprise/entities/doctor';

function toPublicJson(d: Doctor) {
  return {
    id: d.id.toString(),
    slug: d.slug,
    name: d.name,
    crm: d.crm,
    state: d.state,
    city: d.city ?? null,
    specialties: d.specialties,
    telemedicine: d.telemedicine,
    inPerson: d.inPerson,
    bio: d.bio ?? null,
    photoUrl: d.photoUrl ?? null,
    consultationFee: d.consultationFee ?? null,
    contactInfo: d.contactInfo,
  };
}

@Controller('doctors')
@Public()
export class ListDoctorsController {
  constructor(private listDoctors: ListDirectoryDoctorsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('state') state?: string,
    @Query('specialty') specialty?: string,
    @Query('modality') modality?: string,
  ) {
    const parsedModality =
      modality === 'telemedicine' || modality === 'in_person'
        ? modality
        : undefined;

    const result = await this.listDoctors.execute({
      state,
      specialty,
      modality: parsedModality,
    });

    return {
      doctors: result.value.doctors.map(toPublicJson),
    };
  }
}
