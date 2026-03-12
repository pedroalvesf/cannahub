// CannHub shared types, enums, and schemas

// --- Enums ---

export enum UserRole {
  PATIENT = 'patient',
  LEGAL_GUARDIAN = 'legal_guardian',
  PRESCRIBER = 'prescriber',
  VETERINARIAN = 'veterinarian',
  CAREGIVER = 'caregiver',
  ASSOCIATION = 'association',
  ADMIN = 'admin',
}

export enum DocumentType {
  PRESCRIPTION = 'prescription',
  MEDICAL_REPORT = 'medical_report',
  IDENTITY = 'identity',
  PROOF_OF_RESIDENCE = 'proof_of_residence',
  LEGAL_GUARDIANSHIP = 'legal_guardianship',
  PROFESSIONAL_REGISTRATION = 'professional_registration',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum MembershipStatus {
  REQUESTED = 'requested',
  ACTIVE = 'active',
  DENIED = 'denied',
  CANCELLED = 'cancelled',
}

export enum HealthCondition {
  CHRONIC_PAIN = 'chronic_pain',
  ANXIETY = 'anxiety',
  EPILEPSY = 'epilepsy',
  AUTISM = 'autism',
  PARKINSONS = 'parkinsons',
  MULTIPLE_SCLEROSIS = 'multiple_sclerosis',
  FIBROMYALGIA = 'fibromyalgia',
  NAUSEA = 'nausea',
  ADHD = 'adhd',
  PTSD = 'ptsd',
  VETERINARY = 'veterinary',
  OTHER = 'other',
}

export enum UsageForm {
  SUBLINGUAL_OIL = 'sublingual_oil',
  VAPORIZATION = 'vaporization',
  SMOKING = 'smoking',
  TOPICAL = 'topical',
  CAPSULE = 'capsule',
  EDIBLE = 'edible',
}

export enum ExperienceLevel {
  NEVER = 'never',
  LESS_THAN_6M = 'less_than_6m',
  SIX_TO_12M = '6m_to_1y',
  ONE_TO_3Y = '1y_to_3y',
  MORE_THAN_3Y = 'more_than_3y',
}

export enum StrainType {
  INDICA = 'indica',
  SATIVA = 'sativa',
  HYBRID = 'hybrid',
}

export enum ProductType {
  OIL = 'oil',
  FLOWER = 'flower',
  CAPSULE = 'capsule',
  TOPICAL = 'topical',
  EDIBLE = 'edible',
  VAPE = 'vape',
}

// --- Onboarding ---

export enum OnboardingStatus {
  IN_PROGRESS = 'in_progress',
  AWAITING_PRESCRIPTION = 'awaiting_prescription',
  COMPLETED = 'completed',
  ESCALATED = 'escalated',
}

export enum AccountType {
  ADULT_PATIENT = 'adult_patient',
  LEGAL_GUARDIAN = 'legal_guardian',
  PRESCRIBER = 'prescriber',
  VETERINARIAN = 'veterinarian',
  CAREGIVER = 'caregiver',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum MessageSender {
  PATIENT = 'patient',
  AGENT = 'agent',
  SYSTEM = 'system',
}

// --- Patient & Association Domain ---

export enum AccountStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
}

export enum RelationshipType {
  PARENT = 'parent',
  LEGAL_GUARDIAN = 'legal_guardian',
  CAREGIVER = 'caregiver',
  SPOUSE = 'spouse',
}

export enum ProfessionalType {
  PRESCRIBER = 'prescriber',
  VETERINARIAN = 'veterinarian',
}

export enum AssociationStatus {
  PENDING_VERIFICATION = 'pending_verification',
  VERIFIED = 'verified',
  SUSPENDED = 'suspended',
}

export enum AssociationMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  STAFF = 'staff',
}

export enum AssociationMemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum PatientAssociationStatus {
  REQUESTED = 'requested',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum PatientType {
  SELF = 'self',
  DEPENDENT = 'dependent',
}
