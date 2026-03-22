import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { RoleList } from './role-list';
import { Role } from './role';

export interface UserProps {
  email: string;
  password: string;
  name?: string;
  isActive?: boolean;
  lastLoginAt?: Date;
  accountType?: string;
  accountStatus: string;
  onboardingStatus: string;
  documentsStatus: string;
  verificationStatus: string;
  phone?: string;
  cpf?: string;
  birthDate?: Date;
  city?: string;
  state?: string;
  roles: RoleList;
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get name() {
    return this.props.name;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get isActive() {
    return this.props.isActive ?? true;
  }

  get lastLoginAt() {
    return this.props.lastLoginAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get accountType() {
    return this.props.accountType;
  }

  get accountStatus() {
    return this.props.accountStatus;
  }

  get onboardingStatus() {
    return this.props.onboardingStatus;
  }

  get documentsStatus() {
    return this.props.documentsStatus;
  }

  get verificationStatus() {
    return this.props.verificationStatus;
  }

  get phone() {
    return this.props.phone;
  }

  get cpf() {
    return this.props.cpf;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  get city() {
    return this.props.city;
  }

  get state() {
    return this.props.state;
  }

  set accountType(accountType: string | undefined) {
    this.props.accountType = accountType;
    this.touch();
  }

  set accountStatus(status: string) {
    this.props.accountStatus = status;
    this.touch();
  }

  set onboardingStatus(status: string) {
    this.props.onboardingStatus = status;
    this.touch();
  }

  set documentsStatus(status: string) {
    this.props.documentsStatus = status;
    this.touch();
  }

  set verificationStatus(status: string) {
    this.props.verificationStatus = status;
    this.touch();
  }

  set phone(phone: string | undefined) {
    this.props.phone = phone;
    this.touch();
  }

  set cpf(cpf: string | undefined) {
    this.props.cpf = cpf;
    this.touch();
  }

  set birthDate(birthDate: Date | undefined) {
    this.props.birthDate = birthDate;
    this.touch();
  }

  set city(city: string | undefined) {
    this.props.city = city;
    this.touch();
  }

  set state(state: string | undefined) {
    this.props.state = state;
    this.touch();
  }

  get roles() {
    return this.props.roles;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  set name(name: string | undefined) {
    this.props.name = name;
    this.touch();
  }

  set isActive(isActive: boolean) {
    this.props.isActive = isActive;
    this.touch();
  }

  updateLastLogin() {
    this.props.lastLoginAt = new Date();
    this.touch();
  }

  addRole(role: Role) {
    this.props.roles.add(role);
    this.touch();
  }

  removeRole(role: Role) {
    this.props.roles.remove(role);
    this.touch();
  }

  hasRole(roleSlug: string): boolean {
    return this.props.roles.getItems().some((role) => role.slug === roleSlug);
  }

  hasPermission(permissionSlug: string): boolean {
    const allPermissions = this.getAllPermissions();
    return allPermissions.includes(permissionSlug);
  }

  hasAnyPermission(permissionSlugs: string[]): boolean {
    const allPermissions = this.getAllPermissions();
    return permissionSlugs.some((permission) =>
      allPermissions.includes(permission)
    );
  }

  getAllPermissions(): string[] {
    const permissionSet = new Set<string>();
    for (const role of this.props.roles.getItems()) {
      for (const permission of role.permissions.getItems()) {
        permissionSet.add(permission.slug);
      }
    }
    return [...permissionSet];
  }

  getAllRoles(): string[] {
    return this.props.roles.getItems().map((role) => role.slug);
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      UserProps,
      'createdAt' | 'updatedAt' | 'roles' | 'isActive' | 'accountStatus' | 'onboardingStatus' | 'documentsStatus' | 'verificationStatus'
    >,
    id?: UniqueEntityID
  ) {
    return new User(
      {
        ...props,
        roles: props.roles ?? new RoleList(),
        isActive: props.isActive ?? true,
        accountStatus: props.accountStatus ?? 'pending',
        onboardingStatus: props.onboardingStatus ?? 'not_started',
        documentsStatus: props.documentsStatus ?? 'not_submitted',
        verificationStatus: props.verificationStatus ?? 'unverified',
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  static reconstruct(props: UserProps, id?: UniqueEntityID) {
    return new User(props, id);
  }
}
