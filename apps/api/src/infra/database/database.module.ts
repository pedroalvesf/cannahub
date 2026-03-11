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
  ],
})
export class DatabaseModule {}
