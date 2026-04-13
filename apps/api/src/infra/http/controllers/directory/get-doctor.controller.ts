import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { GetDoctorBySlugUseCase } from '@/domain/onboarding/application/use-cases/get-doctor-by-slug';

@Controller('doctors')
@Public()
export class GetDoctorController {
  constructor(private getDoctor: GetDoctorBySlugUseCase) {}

  @Get(':slug')
  @HttpCode(200)
  async handle(@Param('slug') slug: string) {
    const result = await this.getDoctor.execute(slug);
    if (result.isLeft()) {
      throw new NotFoundException('Médico não encontrado.');
    }

    const d = result.value.doctor;
    return {
      doctor: {
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
      },
    };
  }
}
