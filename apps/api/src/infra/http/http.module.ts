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

// Controllers - Associations (public)
import { ListAssociationsController } from './controllers/association/list-associations.controller';
import { GetAssociationController } from './controllers/association/get-association.controller';
import { RequestAssociationLinkController } from './controllers/association/request-link.controller';
import { ListMyLinksController } from './controllers/association/list-my-links.controller';
import { GetAssociationProductTypesController } from './controllers/association/get-association-product-types.controller';
import { GetAssociationProductsPublicController } from './controllers/association/get-association-products-public.controller';

// Controllers - Association Panel
import { AssociationDashboardController } from './controllers/association/association-dashboard.controller';
import { AssociationListProductsController } from './controllers/association/list-products.controller';
import { AssociationCreateProductController } from './controllers/association/create-product.controller';
import { AssociationUpdateProductController } from './controllers/association/update-product.controller';
import { AssociationDeleteProductController } from './controllers/association/delete-product.controller';
import { AssociationListMembersController } from './controllers/association/list-members.controller';
import { AssociationApproveLinkController } from './controllers/association/approve-link.controller';
import { AssociationRejectLinkController } from './controllers/association/reject-link.controller';
import { AssociationRemoveMemberController } from './controllers/association/remove-member.controller';
import { AssociationGetProfileController } from './controllers/association/get-profile.controller';
import { AssociationUpdateProfileController } from './controllers/association/update-profile.controller';

// Controllers - Documents
import { ListDocumentsController } from './controllers/patient/list-documents.controller';
import { JournalController } from './controllers/patient/journal.controller';

// Controllers - Admin
import { AdminListUsersController } from './controllers/admin/list-users.controller';
import { AdminGetUserDetailController } from './controllers/admin/get-user-detail.controller';
import { AdminApproveDocumentController } from './controllers/admin/approve-document.controller';
import { AdminRejectDocumentController } from './controllers/admin/reject-document.controller';
import { AdminUpdateUserStatusController } from './controllers/admin/update-user-status.controller';
import { AdminDeleteUsersController } from './controllers/admin/delete-users.controller';

// Controllers - Directory (public)
import { ListDoctorsController } from './controllers/directory/list-doctors.controller';
import { GetDoctorController } from './controllers/directory/get-doctor.controller';

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
import { GetUserAssociationUseCase } from '@/domain/association/application/use-cases/get-user-association';
import { ListAssociationProductsUseCase } from '@/domain/association/application/use-cases/list-association-products';
import { CreateProductUseCase } from '@/domain/association/application/use-cases/create-product';
import { UpdateProductUseCase } from '@/domain/association/application/use-cases/update-product';
import { DeleteProductUseCase } from '@/domain/association/application/use-cases/delete-product';
import { ListAssociationLinksUseCase } from '@/domain/association/application/use-cases/list-association-links';
import { ApproveLinkRequestUseCase } from '@/domain/association/application/use-cases/approve-link-request';
import { RejectLinkRequestUseCase } from '@/domain/association/application/use-cases/reject-link-request';
import { RemoveMemberUseCase } from '@/domain/association/application/use-cases/remove-member';
import { GetAssociationProfileUseCase } from '@/domain/association/application/use-cases/get-association-profile';
import { UpdateAssociationProfileUseCase } from '@/domain/association/application/use-cases/update-association-profile';
import { GetAssociationDashboardUseCase } from '@/domain/association/application/use-cases/get-association-dashboard';
import { RequestAssociationLinkUseCase } from '@/domain/association/application/use-cases/request-association-link';
import { ListMyLinksUseCase } from '@/domain/association/application/use-cases/list-my-links';

// Use Cases - Documents
import { ListUserDocumentsUseCase } from '@/domain/patient/application/use-cases/list-user-documents';
import { GetDocumentByIdUseCase } from '@/domain/patient/application/use-cases/get-document-by-id';

// Use Cases - Journal
import { CreateJournalEntryUseCase } from '@/domain/patient/application/use-cases/create-journal-entry';
import { ListJournalEntriesUseCase } from '@/domain/patient/application/use-cases/list-journal-entries';
import { UpdateJournalEntryUseCase } from '@/domain/patient/application/use-cases/update-journal-entry';
import { DeleteJournalEntryUseCase } from '@/domain/patient/application/use-cases/delete-journal-entry';

// Use Cases - Admin
import { ListUsersUseCase } from '@/domain/admin/application/use-cases/list-users';
import { GetUserDetailUseCase } from '@/domain/admin/application/use-cases/get-user-detail';
import { ApproveDocumentUseCase } from '@/domain/admin/application/use-cases/approve-document';
import { RejectDocumentUseCase } from '@/domain/admin/application/use-cases/reject-document';
import { UpdateUserStatusUseCase } from '@/domain/admin/application/use-cases/update-user-status';
import { DeleteUsersUseCase } from '@/domain/admin/application/use-cases/delete-users';

// Use Cases - Directory
import { ListDirectoryDoctorsUseCase } from '@/domain/onboarding/application/use-cases/list-directory-doctors';
import { GetDoctorBySlugUseCase } from '@/domain/onboarding/application/use-cases/get-doctor-by-slug';

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

    // Association Controllers (public)
    ListAssociationsController,
    GetAssociationController,
    RequestAssociationLinkController,
    ListMyLinksController,
    GetAssociationProductTypesController,
    GetAssociationProductsPublicController,

    // Association Panel Controllers
    AssociationDashboardController,
    AssociationListProductsController,
    AssociationCreateProductController,
    AssociationUpdateProductController,
    AssociationDeleteProductController,
    AssociationListMembersController,
    AssociationApproveLinkController,
    AssociationRejectLinkController,
    AssociationRemoveMemberController,
    AssociationGetProfileController,
    AssociationUpdateProfileController,

    // Admin Controllers
    AdminListUsersController,
    AdminGetUserDetailController,
    AdminApproveDocumentController,
    AdminRejectDocumentController,
    AdminUpdateUserStatusController,
    AdminDeleteUsersController,

    // Document Controllers
    ListDocumentsController,
    JournalController,

    // Directory Controllers (public)
    ListDoctorsController,
    GetDoctorController,

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
    GetUserAssociationUseCase,
    ListAssociationProductsUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    ListAssociationLinksUseCase,
    ApproveLinkRequestUseCase,
    RejectLinkRequestUseCase,
    RemoveMemberUseCase,
    GetAssociationProfileUseCase,
    UpdateAssociationProfileUseCase,
    GetAssociationDashboardUseCase,
    RequestAssociationLinkUseCase,
    ListMyLinksUseCase,

    // Admin Use Cases
    ListUsersUseCase,
    GetUserDetailUseCase,
    ApproveDocumentUseCase,
    RejectDocumentUseCase,
    UpdateUserStatusUseCase,
    DeleteUsersUseCase,

    // Document Use Cases
    ListUserDocumentsUseCase,
    GetDocumentByIdUseCase,

    // Journal Use Cases
    CreateJournalEntryUseCase,
    ListJournalEntriesUseCase,
    UpdateJournalEntryUseCase,
    DeleteJournalEntryUseCase,

    // Directory Use Cases
    ListDirectoryDoctorsUseCase,
    GetDoctorBySlugUseCase,

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
