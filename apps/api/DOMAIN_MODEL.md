# CannHub — Modelo de Dominio

Referencia rapida de todas as entidades, enums e relacoes do sistema.
Ultima atualizacao: marco/2026.

---

## Visao Geral

O modelo se organiza em 3 bounded contexts:

```
auth/           User, Role, Permission (RBAC generico)
patient/        Dependent, Patient, Document, ProfessionalProfile
association/    Association, AssociationMember, PatientAssociationLink
```

O onboarding (OnboardingSession, SupportTicket, etc.) ja existia e nao e coberto aqui.

---

## Diagrama de Relacoes

```
User
 ├── 1:1  Patient (type=SELF)          "eu sou o paciente"
 ├── 1:N  Dependent                     "meus dependentes"
 │          └── 1:1  Patient (type=DEPENDENT)
 ├── 1:N  Document                      "meus uploads"
 ├── 1:1  ProfessionalProfile?          "CRM/CRMV se for prescritor"
 ├── N:M  Role (via UserRole)           "RBAC"
 └── 1:N  AssociationMember             "trabalho em N associacoes"

Patient  (resolve userId XOR dependentId)
 └── 1:N  PatientAssociationLink        "vinculado a N associacoes"

Association
 ├── 1:N  AssociationMember             "equipe da associacao"
 └── 1:N  PatientAssociationLink        "pacientes vinculados"
```

A entidade **Patient** e o ponto-chave: ela unifica o polimorfismo
"paciente adulto (User direto) vs dependente (Dependent)" num unico ID.
Tudo que referencia "o paciente atendido" aponta pra `patientId`.

---

## Entidades

### User (extendido)

| Campo              | Tipo     | Default        | Descricao                                |
|--------------------|----------|----------------|------------------------------------------|
| email              | string   | —              | Unico, login                             |
| password           | string   | —              | Hash bcrypt                              |
| name               | string?  | —              | Nome completo                            |
| cpf                | string?  | — (unique)     | CPF do usuario                           |
| phone              | string?  | —              | Telefone                                 |
| birthDate          | Date?    | —              | Data de nascimento                       |
| city               | string?  | —              | Cidade                                   |
| state              | string?  | —              | UF                                       |
| accountType        | string?  | —              | `AccountType` enum (ver abaixo)          |
| accountStatus      | string   | `"pending"`    | `AccountStatus` enum                     |
| verificationStatus | string   | `"unverified"` | `VerificationStatus` enum                |
| isActive           | boolean  | true           | Soft-delete                              |

### Dependent

| Campo            | Tipo    | Descricao                                       |
|------------------|---------|-------------------------------------------------|
| guardianUserId   | FK User | Quem e responsavel por este dependente           |
| name             | string  | Nome do dependente                               |
| birthDate        | Date?   | Data de nascimento                               |
| documentNumber   | string? | RG/CPF do dependente                             |
| relationshipType | string  | `RelationshipType` enum                          |
| proofDocumentId  | string? | FK Document (comprovante de tutela)              |

### Patient

| Campo       | Tipo         | Descricao                                          |
|-------------|--------------|-----------------------------------------------------|
| userId      | FK User?     | Preenchido se type=SELF (unique)                    |
| dependentId | FK Dependent?| Preenchido se type=DEPENDENT (unique)               |
| type        | string       | `PatientType`: `self` ou `dependent`                |

**Invariante**: exatamente um de `userId`/`dependentId` preenchido.
Validado no `Patient.create()` da entidade de dominio.

### Document

| Campo           | Tipo     | Default     | Descricao                             |
|-----------------|----------|-------------|---------------------------------------|
| userId          | FK User  | —           | Quem fez o upload                     |
| dependentId     | FK Dependent? | —      | Se o doc e de um dependente           |
| type            | string   | —           | `DocumentType` enum                   |
| url             | string   | —           | URL no S3                             |
| status          | string   | `"pending"` | `DocumentStatus` enum                 |
| rejectionReason | string?  | —           | Motivo se rejeitado                   |
| reviewedBy      | FK User? | —           | Admin que revisou                     |
| reviewedAt      | Date?    | —           | Quando foi revisado                   |

**Metodos de dominio**: `approve(reviewerId)`, `reject(reviewerId, reason)`

### ProfessionalProfile

| Campo              | Tipo    | Descricao                                    |
|--------------------|---------|----------------------------------------------|
| userId             | FK User | 1:1 com User (unique)                        |
| type               | string  | `ProfessionalType`: `prescriber` ou `veterinarian` |
| registrationNumber | string  | Numero CRM/CRMV                              |
| registrationState  | string  | UF do registro                               |
| specialty          | string? | Especialidade                                |
| verifiedAt         | Date?   | Quando foi verificado                        |

**Constraint**: unique em `(registrationNumber, registrationState)`.
**Metodo de dominio**: `verify()`

### Association (AggregateRoot)

| Campo             | Tipo     | Default                    | Descricao                     |
|-------------------|----------|----------------------------|-------------------------------|
| name              | string   | —                          | Nome da associacao            |
| cnpj              | string   | — (unique)                 | CNPJ                          |
| status            | string   | `"pending_verification"`   | `AssociationStatus` enum      |
| description       | string?  | —                          | Descricao                     |
| region            | string   | —                          | Regiao (Sudeste, Sul, etc.)   |
| state             | string   | —                          | UF                            |
| city              | string   | —                          | Cidade                        |
| profileTypes      | string[] | []                         | Tipos de paciente atendidos   |
| hasAssistedAccess | boolean  | false                      | Atende acesso assistido?      |
| contactEmail      | string   | —                          | Email de contato              |
| contactPhone      | string?  | —                          | Telefone                      |
| website           | string?  | —                          | Site                          |
| logoUrl           | string?  | —                          | Logo                          |
| claimedAt         | Date?    | —                          | Quando foi reivindicada       |

**Metodos de dominio**: `verify()`, `suspend()`, `claim()`

### AssociationMember

| Campo         | Tipo           | Default    | Descricao                        |
|---------------|----------------|------------|----------------------------------|
| associationId | FK Association | —          | Qual associacao                  |
| userId        | FK User        | —          | Qual usuario                     |
| role          | string         | `"staff"`  | `AssociationMemberRole` enum     |
| status        | string         | `"active"` | `AssociationMemberStatus` enum   |
| assignedAt    | Date           | now()      | Quando foi adicionado            |

**Constraint**: unique em `(associationId, userId)`.
**Metodos de dominio**: `deactivate()`, `changeRole(role)`

### PatientAssociationLink

| Campo             | Tipo           | Default       | Descricao                      |
|-------------------|----------------|---------------|--------------------------------|
| associationId     | FK Association | —             | Qual associacao                |
| patientId         | FK Patient     | —             | Qual paciente (unificado)      |
| requestedByUserId | FK User        | —             | Quem solicitou o vinculo       |
| status            | string         | `"requested"` | `PatientAssociationStatus`     |
| approvedByUserId  | FK User?       | —             | Quem aprovou                   |
| startDate         | Date?          | —             | Inicio do vinculo              |
| endDate           | Date?          | —             | Fim do vinculo                 |

**Metodos de dominio**: `approve(approvedBy)`, `reject()`, `cancel()`

**Ciclo de vida**:
```
REQUESTED ──approve()──> ACTIVE
REQUESTED ──reject()───> REJECTED
ACTIVE    ──cancel()───> CANCELLED
```

---

## Enums

### Conta e Verificacao

| Enum               | Valores                                                           | Usado em                    |
|--------------------|-------------------------------------------------------------------|-----------------------------|
| AccountType        | `adult_patient`, `legal_guardian`, `prescriber`, `veterinarian`, `caregiver` | User.accountType   |
| AccountStatus      | `pending`, `approved`, `rejected`, `suspended`                    | User.accountStatus          |
| VerificationStatus | `unverified`, `pending`, `verified`                               | User.verificationStatus     |
| PatientType        | `self`, `dependent`                                               | Patient.type                |

### Documentos

| Enum           | Valores                                                                                          | Usado em      |
|----------------|--------------------------------------------------------------------------------------------------|---------------|
| DocumentType   | `prescription`, `medical_report`, `identity`, `proof_of_residence`, `legal_guardianship`, `professional_registration` | Document.type |
| DocumentStatus | `pending`, `approved`, `rejected`                                                                | Document.status |

### Relacoes e Profissional

| Enum             | Valores                                              | Usado em                      |
|------------------|------------------------------------------------------|-------------------------------|
| RelationshipType | `parent`, `legal_guardian`, `caregiver`, `spouse`    | Dependent.relationshipType    |
| ProfessionalType | `prescriber`, `veterinarian`                         | ProfessionalProfile.type      |

### Associacao

| Enum                      | Valores                                    | Usado em                      |
|---------------------------|--------------------------------------------|-------------------------------|
| AssociationStatus         | `pending_verification`, `verified`, `suspended` | Association.status       |
| AssociationMemberRole     | `owner`, `admin`, `staff`                  | AssociationMember.role        |
| AssociationMemberStatus   | `active`, `inactive`                       | AssociationMember.status      |
| PatientAssociationStatus  | `requested`, `active`, `rejected`, `cancelled` | PatientAssociationLink.status |

### RBAC (auth/)

| Enum     | Valores                                                                              | Usado em   |
|----------|--------------------------------------------------------------------------------------|------------|
| UserRole | `patient`, `legal_guardian`, `prescriber`, `veterinarian`, `caregiver`, `association`, `admin` | Role.slug |

---

## Fluxos Principais

### 1. Paciente adulto se cadastra e solicita vinculo

```
1. User criado (accountType=adult_patient, accountStatus=pending)
2. Patient criado (userId=User.id, type=self)
3. User faz upload de Documents (prescription, medical_report, identity, proof_of_residence)
4. Admin revisa → Document.approve() → User.accountStatus = approved
5. Patient busca Association compativel
6. PatientAssociationLink criado (status=requested)
7. Associacao avalia → link.approve() → status=active
```

### 2. Responsavel legal cadastra dependente

```
1. User criado (accountType=legal_guardian)
2. Dependent criado (guardianUserId=User.id, relationshipType=parent)
3. Patient criado (dependentId=Dependent.id, type=dependent)
4. Documents uploadados (incluindo legal_guardianship)
5. Mesmo fluxo de aprovacao → vinculo via PatientAssociationLink(patientId)
```

### 3. Prescritor se cadastra

```
1. User criado (accountType=prescriber)
2. ProfessionalProfile criado (type=prescriber, registrationNumber=CRM-XXXXX)
3. Admin verifica → profile.verify()
4. User.verificationStatus = verified
```

### 4. Associacao e reivindicada

```
1. Association pre-cadastrada pelo admin (status=pending_verification)
2. Admin verifica → association.verify()
3. User de representante cria conta
4. AssociationMember criado (role=owner)
5. association.claim() → claimedAt preenchido
```

---

## Estrutura de Arquivos (dominio novo)

```
src/domain/
├── patient/
│   ├── enterprise/entities/
│   │   ├── dependent.ts
│   │   ├── patient.ts
│   │   ├── document.ts
│   │   └── professional-profile.ts
│   └── application/repositories/
│       ├── dependents-repository.ts
│       ├── patients-repository.ts
│       ├── documents-repository.ts
│       └── professional-profiles-repository.ts
└── association/
    ├── enterprise/entities/
    │   ├── association.ts
    │   ├── association-member.ts
    │   └── patient-association-link.ts
    └── application/repositories/
        ├── associations-repository.ts
        ├── association-members-repository.ts
        └── patient-association-links-repository.ts

src/infra/database/prisma/
├── mappers/
│   ├── prisma-dependent-mapper.ts
│   ├── prisma-patient-mapper.ts
│   ├── prisma-document-mapper.ts
│   ├── prisma-professional-profile-mapper.ts
│   ├── prisma-association-mapper.ts
│   ├── prisma-association-member-mapper.ts
│   └── prisma-patient-association-link-mapper.ts
└── repositories/
    ├── prisma-dependents-repository.ts
    ├── prisma-patients-repository.ts
    ├── prisma-documents-repository.ts
    ├── prisma-professional-profiles-repository.ts
    ├── prisma-associations-repository.ts
    ├── prisma-association-members-repository.ts
    └── prisma-patient-association-links-repository.ts

test/
├── repositories/
│   ├── in-memory-dependents-repository.ts
│   ├── in-memory-patients-repository.ts
│   ├── in-memory-documents-repository.ts
│   ├── in-memory-professional-profiles-repository.ts
│   ├── in-memory-associations-repository.ts
│   ├── in-memory-association-members-repository.ts
│   └── in-memory-patient-association-links-repository.ts
└── factories/
    ├── make-dependent.ts
    ├── make-patient.ts
    ├── make-document.ts
    ├── make-professional-profile.ts
    ├── make-association.ts
    ├── make-association-member.ts
    └── make-patient-association-link.ts
```

---

## Decisoes de Design

**Por que a entidade Patient existe?**
Sem ela, toda tabela que referencia "o paciente" precisaria de `userId? OR dependentId?` com checks e joins duplos. Patient resolve isso uma vez: downstream tudo usa `patientId`.

**Por que Association e AggregateRoot?**
E raiz do bounded context de associacao. Futuramente emite domain events (ex: AssociationVerifiedEvent) pra notificacoes e side-effects.

**Por que 4 status no vinculo (nao 6)?**
REQUESTED, ACTIVE, REJECTED, CANCELLED cobrem o MVP. Status como PENDING_ASSOCIATION_REVIEW e UNDER_REVIEW sao prematuros — a associacao ve o pedido e decide, sem fila intermediaria.

**Por que Dependent sem DependentLink?**
FK direto `guardianUserId` no Dependent. Suficiente pro MVP — um dependente tem um responsavel. Multi-guardian vem se/quando precisar.
