import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { PrismaRefreshTokenRepository } from './prisma/repositories/prisma-refresh-token-repository';
import { DevicesRepository } from '@/domain/auth/application/repositories/devices-repository';
import { PrismaDevicesRepository } from './prisma/repositories/prisma-devices-repository';
import { RefreshTokenRepository } from '@/domain/auth/application/repositories/refresh-token-repository';
import { PermissionsRepository } from '@/domain/auth/application/repositories/permissions-repository';
import { PrismaRolesRepository } from './prisma/repositories/prisma-roles-repository';
import { PrismaPermissionsRepository } from './prisma/repositories/prisma-permissions-repository';
import { RolesRepository } from '@/domain/auth/application/repositories/roles-repository';
import { UserRolesRepository } from '@/domain/auth/application/repositories/user-roles-repository';
import { RolePermissionsRepository } from '@/domain/auth/application/repositories/role-permissions-repository';
import { PrismaUserRolesRepository } from './prisma/repositories/prisma-user-roles-repository';
import { PrismaRolePermissionsRepository } from './prisma/repositories/prisma-role-permissions-repository';

// Onboarding
import { OnboardingSessionsRepository } from '@/domain/onboarding/application/repositories/onboarding-sessions-repository';
import { PrismaOnboardingSessionsRepository } from './prisma/repositories/prisma-onboarding-sessions-repository';
import { SupportTicketsRepository } from '@/domain/onboarding/application/repositories/support-tickets-repository';
import { PrismaSupportTicketsRepository } from './prisma/repositories/prisma-support-tickets-repository';
import { SupportMessagesRepository } from '@/domain/onboarding/application/repositories/support-messages-repository';
import { PrismaSupportMessagesRepository } from './prisma/repositories/prisma-support-messages-repository';
import { DoctorsRepository } from '@/domain/onboarding/application/repositories/doctors-repository';
import { PrismaDoctorsRepository } from './prisma/repositories/prisma-doctors-repository';

// Patient
import { DependentsRepository } from '@/domain/patient/application/repositories/dependents-repository';
import { PrismaDependentsRepository } from './prisma/repositories/prisma-dependents-repository';
import { PatientsRepository } from '@/domain/patient/application/repositories/patients-repository';
import { PrismaPatientsRepository } from './prisma/repositories/prisma-patients-repository';
import { DocumentsRepository } from '@/domain/patient/application/repositories/documents-repository';
import { PrismaDocumentsRepository } from './prisma/repositories/prisma-documents-repository';
import { ProfessionalProfilesRepository } from '@/domain/patient/application/repositories/professional-profiles-repository';
import { PrismaProfessionalProfilesRepository } from './prisma/repositories/prisma-professional-profiles-repository';

// Address
import { AddressesRepository } from '@/domain/auth/application/repositories/addresses-repository';
import { PrismaAddressesRepository } from './prisma/repositories/prisma-addresses-repository';

// Diary
import { DiaryEntriesRepository } from '@/domain/diary/application/repositories/diary-entries-repository';
import { PrismaDiaryEntriesRepository } from './prisma/repositories/prisma-diary-entries-repository';
import { DiaryFavoritesRepository } from '@/domain/diary/application/repositories/diary-favorites-repository';
import { PrismaDiaryFavoritesRepository } from './prisma/repositories/prisma-diary-favorites-repository';

// Association
import { AssociationsRepository } from '@/domain/association/application/repositories/associations-repository';
import { PrismaAssociationsRepository } from './prisma/repositories/prisma-associations-repository';
import { AssociationMembersRepository } from '@/domain/association/application/repositories/association-members-repository';
import { PrismaAssociationMembersRepository } from './prisma/repositories/prisma-association-members-repository';
import { PatientAssociationLinksRepository } from '@/domain/association/application/repositories/patient-association-links-repository';
import { PrismaPatientAssociationLinksRepository } from './prisma/repositories/prisma-patient-association-links-repository';
import { ProductsRepository } from '@/domain/association/application/repositories/products-repository';
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository';
import { ProductVariantsRepository } from '@/domain/association/application/repositories/product-variants-repository';
import { PrismaProductVariantsRepository } from './prisma/repositories/prisma-product-variants-repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: DevicesRepository,
      useClass: PrismaDevicesRepository,
    },
    {
      provide: RefreshTokenRepository,
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: RolesRepository,
      useClass: PrismaRolesRepository,
    },
    {
      provide: PermissionsRepository,
      useClass: PrismaPermissionsRepository,
    },
    {
      provide: UserRolesRepository,
      useClass: PrismaUserRolesRepository,
    },
    {
      provide: RolePermissionsRepository,
      useClass: PrismaRolePermissionsRepository,
    },
    // Onboarding
    {
      provide: OnboardingSessionsRepository,
      useClass: PrismaOnboardingSessionsRepository,
    },
    {
      provide: SupportTicketsRepository,
      useClass: PrismaSupportTicketsRepository,
    },
    {
      provide: SupportMessagesRepository,
      useClass: PrismaSupportMessagesRepository,
    },
    {
      provide: DoctorsRepository,
      useClass: PrismaDoctorsRepository,
    },
    // Patient
    {
      provide: DependentsRepository,
      useClass: PrismaDependentsRepository,
    },
    {
      provide: PatientsRepository,
      useClass: PrismaPatientsRepository,
    },
    {
      provide: DocumentsRepository,
      useClass: PrismaDocumentsRepository,
    },
    {
      provide: ProfessionalProfilesRepository,
      useClass: PrismaProfessionalProfilesRepository,
    },
    // Association
    {
      provide: AssociationsRepository,
      useClass: PrismaAssociationsRepository,
    },
    {
      provide: AssociationMembersRepository,
      useClass: PrismaAssociationMembersRepository,
    },
    {
      provide: PatientAssociationLinksRepository,
      useClass: PrismaPatientAssociationLinksRepository,
    },
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    {
      provide: ProductVariantsRepository,
      useClass: PrismaProductVariantsRepository,
    },
    // Diary
    {
      provide: DiaryEntriesRepository,
      useClass: PrismaDiaryEntriesRepository,
    },
    {
      provide: DiaryFavoritesRepository,
      useClass: PrismaDiaryFavoritesRepository,
    },
    // Address
    {
      provide: AddressesRepository,
      useClass: PrismaAddressesRepository,
    },
  ],
  exports: [
    PrismaService,
    DevicesRepository,
    RefreshTokenRepository,
    UsersRepository,
    RolesRepository,
    PermissionsRepository,
    UserRolesRepository,
    RolePermissionsRepository,
    // Onboarding
    OnboardingSessionsRepository,
    SupportTicketsRepository,
    SupportMessagesRepository,
    DoctorsRepository,
    // Patient
    DependentsRepository,
    PatientsRepository,
    DocumentsRepository,
    ProfessionalProfilesRepository,
    // Association
    AssociationsRepository,
    AssociationMembersRepository,
    PatientAssociationLinksRepository,
    ProductsRepository,
    ProductVariantsRepository,
    // Diary
    DiaryEntriesRepository,
    DiaryFavoritesRepository,
    // Address
    AddressesRepository,
  ],
})
export class DatabaseModule {}
