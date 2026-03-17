import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { EnvModule } from '../env/env.module';
import { AuthModule } from '../auth/auth.module';
import { AiModule } from '../ai/ai.module';

// Controllers - Auth
import { CreateUserController } from './controllers/auth/create-user.controller';
import { DeleteUserController } from './controllers/auth/delete-user.controller';
import { AuthenticateDeviceController } from './controllers/auth/authenticate-device.controller';
import { RevokeAllDevicesController } from './controllers/auth/revoke-all-devices.controller';
import { RevokeDeviceSessionController } from './controllers/auth/revoke-device-session.controller';
import { GetMeController } from './controllers/auth/get-me.controller';
import { RefreshTokenController } from './controllers/auth/refresh-token.controller';
import { AddressController } from './controllers/auth/save-address.controller';

// Controllers - Roles
import { CreateRoleController } from './controllers/auth/create-role.controller';
import { ListRolesController } from './controllers/auth/list-roles.controller';
import { AssignRoleController } from './controllers/auth/assign-role.controller';
import { RemoveRoleController } from './controllers/auth/remove-role.controller';

// Controllers - Permissions
import { CreatePermissionController } from './controllers/auth/create-permission.controller';
import { ListPermissionsController } from './controllers/auth/list-permissions.controller';

// Controllers - Profile
import { UpdateProfileController } from './controllers/auth/update-profile.controller';

// Controllers - Associations
import { ListAssociationsController } from './controllers/association/list-associations.controller';
import { GetAssociationController } from './controllers/association/get-association.controller';

// Controllers - Documents
import { ListDocumentsController } from './controllers/patient/list-documents.controller';

// Controllers - Onboarding
import { StartOnboardingController } from './controllers/onboarding/start-onboarding.controller';
import { SubmitStepController } from './controllers/onboarding/submit-step.controller';
import { CompleteOnboardingController } from './controllers/onboarding/complete-onboarding.controller';
import { GetOnboardingSummaryController } from './controllers/onboarding/get-onboarding-summary.controller';
import { EscalateToHumanController } from './controllers/onboarding/escalate-to-human.controller';
import { ExtractFromTextController } from './controllers/onboarding/extract-from-text.controller';

// Use Cases - Auth
import { CreateUserUseCase } from '@/domain/auth/application/use-cases/create-user';
import { DeleteUserUseCase } from '@/domain/auth/application/use-cases/delete-user';
import { AuthenticateDeviceUseCase } from '@/domain/auth/application/use-cases/authenticate-device';
import { RevokeAllDevicesUseCase } from '@/domain/auth/application/use-cases/revoke-all-devices';
import { RevokeDeviceSessionUseCase } from '@/domain/auth/application/use-cases/revoke-device-session';
import { GetUserByIdUseCase } from '@/domain/auth/application/use-cases/get-user-by-id';
import { RefreshAccessTokenUseCase } from '@/domain/auth/application/use-cases/refresh-access-token';
import { SaveAddressUseCase } from '@/domain/auth/application/use-cases/save-address';
import { GetAddressUseCase } from '@/domain/auth/application/use-cases/get-address';

// Use Cases - Roles
import { CreateRoleUseCase } from '@/domain/auth/application/use-cases/create-role';
import { ListRolesUseCase } from '@/domain/auth/application/use-cases/list-roles';
import { AssignRoleToUserUseCase } from '@/domain/auth/application/use-cases/assign-role-to-user';
import { RemoveRoleFromUserUseCase } from '@/domain/auth/application/use-cases/remove-role-from-user';

// Use Cases - Permissions
import { CreatePermissionUseCase } from '@/domain/auth/application/use-cases/create-permission';
import { ListPermissionsUseCase } from '@/domain/auth/application/use-cases/list-permissions';
import { CheckUserPermissionUseCase } from '@/domain/auth/application/use-cases/check-user-permission';

// Use Cases - Profile
import { UpdateProfileUseCase } from '@/domain/auth/application/use-cases/update-profile';

// Use Cases - Associations
import { ListAssociationsUseCase } from '@/domain/association/application/use-cases/list-associations';
import { GetAssociationByIdUseCase } from '@/domain/association/application/use-cases/get-association-by-id';

// Use Cases - Documents
import { ListUserDocumentsUseCase } from '@/domain/patient/application/use-cases/list-user-documents';
import { GetDocumentByIdUseCase } from '@/domain/patient/application/use-cases/get-document-by-id';

// Use Cases - Onboarding
import { StartOnboardingUseCase } from '@/domain/onboarding/application/use-cases/start-onboarding';
import { SubmitStepUseCase } from '@/domain/onboarding/application/use-cases/submit-step';
import { CompleteOnboardingUseCase } from '@/domain/onboarding/application/use-cases/complete-onboarding';
import { GetOnboardingSummaryUseCase } from '@/domain/onboarding/application/use-cases/get-onboarding-summary';
import { EscalateToHumanUseCase } from '@/domain/onboarding/application/use-cases/escalate-to-human';
import { ExtractFromTextUseCase } from '@/domain/onboarding/application/use-cases/extract-from-text';

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule, AuthModule, AiModule],
  controllers: [
    // Auth Controllers
    CreateUserController,
    DeleteUserController,
    AuthenticateDeviceController,
    RevokeAllDevicesController,
    RevokeDeviceSessionController,
    GetMeController,
    RefreshTokenController,
    AddressController,

    // Role Controllers
    CreateRoleController,
    ListRolesController,
    AssignRoleController,
    RemoveRoleController,

    // Permission Controllers
    CreatePermissionController,
    ListPermissionsController,

    // Profile Controllers
    UpdateProfileController,

    // Association Controllers
    ListAssociationsController,
    GetAssociationController,

    // Document Controllers
    ListDocumentsController,

    // Onboarding Controllers
    StartOnboardingController,
    SubmitStepController,
    CompleteOnboardingController,
    GetOnboardingSummaryController,
    EscalateToHumanController,
    ExtractFromTextController,
  ],
  providers: [
    // Auth Use Cases
    CreateUserUseCase,
    DeleteUserUseCase,
    AuthenticateDeviceUseCase,
    RevokeAllDevicesUseCase,
    RevokeDeviceSessionUseCase,
    GetUserByIdUseCase,
    RefreshAccessTokenUseCase,
    SaveAddressUseCase,
    GetAddressUseCase,

    // Role Use Cases
    CreateRoleUseCase,
    ListRolesUseCase,
    AssignRoleToUserUseCase,
    RemoveRoleFromUserUseCase,

    // Permission Use Cases
    CreatePermissionUseCase,
    ListPermissionsUseCase,
    CheckUserPermissionUseCase,

    // Profile Use Cases
    UpdateProfileUseCase,

    // Association Use Cases
    ListAssociationsUseCase,
    GetAssociationByIdUseCase,

    // Document Use Cases
    ListUserDocumentsUseCase,
    GetDocumentByIdUseCase,

    // Onboarding Use Cases
    StartOnboardingUseCase,
    SubmitStepUseCase,
    CompleteOnboardingUseCase,
    GetOnboardingSummaryUseCase,
    EscalateToHumanUseCase,
    ExtractFromTextUseCase,
  ],
})
export class HttpModule {}
