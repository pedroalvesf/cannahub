# CannHub — Modelo de Domínio

## Contextos delimitados (Bounded Contexts)

O backend segue Clean Architecture + DDD, organizado em três domínios principais:

```
domain/
├── auth/           # Identidade, autenticação, RBAC
├── onboarding/     # Perfil clínico, escalação, extração
└── association/    # Associações, produtos, vínculos
     (+ admin/)     # Aprovação de usuários e documentos
```

## Diagrama de entidades

```
┌──────────────────────────────────────────────────────────────────────┐
│                          IDENTIDADE (Auth)                           │
│                                                                      │
│  User ─┬─ Device ── RefreshToken                                    │
│        ├─ AccessToken                                                │
│        ├─ LoginHistory                                               │
│        ├─ AuditLog                                                   │
│        ├─ UserRole ── Role ── RolePermission ── Permission          │
│        ├─ Address                                                    │
│        └─ ProfessionalProfile                                        │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                        ONBOARDING (Clínico)                          │
│                                                                      │
│  User ── OnboardingSession ── SupportTicket ── SupportMessage       │
│                                                                      │
│  Doctor (diretório, futuro)                                          │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         PACIENTE (Patient)                           │
│                                                                      │
│  User ─┬─ Patient ── PatientAssociationLink                         │
│        ├─ Dependent ── Patient                                       │
│        └─ Document                                                   │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                       ASSOCIAÇÃO (Association)                       │
│                                                                      │
│  Association ─┬─ AssociationMember (staff/manager/director)          │
│               ├─ PatientAssociationLink (vínculo com paciente)       │
│               └─ Product ── ProductVariant                           │
└──────────────────────────────────────────────────────────────────────┘
```

## Entidades e seus campos

### User (centro do sistema)

O User é a entidade raiz. Todos os demais domínios se conectam a ele.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | PK |
| email | String | Único, login |
| password | String | Hash bcryptjs |
| name | String? | Nome completo |
| accountType | String? | patient, guardian, caregiver, prescriber, veterinarian |
| accountStatus | String | pending, approved, rejected |
| onboardingStatus | String | not_started, in_progress, completed |
| documentsStatus | String | not_submitted, pending_review, approved, rejected |
| verificationStatus | String | unverified, verified |
| phone, cpf | String? | Dados pessoais (CPF único) |
| birthDate, city, state | - | Dados demográficos |

**Relações**: Devices, RefreshTokens, AccessTokens, LoginHistory, UserRoles, Documents, Patient, Dependents, OnboardingSession, Address, AssociationMemberships, ProfessionalProfile, AuditLogs.

### OnboardingSession (perfil clínico)

Sessão 1:1 com User. Armazena respostas do acolhimento em 5-6 steps.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| condition | String? | Condição de saúde (multi-select, separado por vírgula) |
| experience | String? | never, less_than_1_year, 1_to_3_years, more_than_3_years |
| currentAccessMethod | String? | regulated_association, anvisa_import, informal, self_cultivation, not_accessing |
| preferredForm | String? | Forma de uso preferida (multi-select) |
| hasPrescription | Boolean? | Tem receita médica? |
| assistedAccess | Boolean? | Precisa de acesso assistido? |
| summary | String? | Resumo gerado |

**Regra**: `accountType` vive no User, nunca na OnboardingSession.

### Document

| Campo | Tipo | Descrição |
|-------|------|-----------|
| type | String | medical_prescription, medical_report, identity_document, proof_of_residence |
| url | String | URL do arquivo (S3 futuro) |
| status | String | pending, approved, rejected |
| rejectionReason | String? | Motivo da rejeição (preenchido pelo admin) |
| reviewedBy | String? | FK → User (admin que revisou) |

**Cascade**: quando todos os docs de um user são aprovados → `user.documentsStatus = 'approved'`. Se qualquer um é rejeitado → `'rejected'`.

### Association

| Campo | Tipo | Descrição |
|-------|------|-----------|
| name | String | Nome da associação |
| cnpj | String | CNPJ único |
| status | String | pending_verification, active, suspended |
| region, state, city | String | Localização |
| profileTypes | String[] | Tipos de paciente atendidos |
| hasAssistedAccess | Boolean | Oferece acesso assistido? |
| membershipFee | Decimal? | Valor da anuidade |
| membershipPeriod | String? | annual, semiannual, monthly, none |
| membershipDescription | String? | Descrição da anuidade |

### AssociationMember (equipe da associação)

Relaciona User ↔ Association. Define quem opera o painel da associação.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| role | String | staff, manager, director |
| status | String | active, inactive |

### PatientAssociationLink (vínculo paciente ↔ associação)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| status | String | requested, approved, rejected, cancelled |
| feeStatus | String? | pending, paid, overdue, exempt |
| feeExpiresAt | DateTime? | Quando vence a anuidade |

**Regra**: vínculo é opcional. Conta aprovada já permite ver preços. Associação pode exigir vínculo/taxa ou não.

### Patient

Entidade intermediária entre User e seus vínculos com associações.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| userId | String? | FK → User (paciente é o próprio user) |
| dependentId | String? | FK → Dependent (paciente é dependente de um responsável) |
| type | String | SELF ou DEPENDENT |

**Criação**: Patient é criado automaticamente quando o paciente solicita seu primeiro vínculo com uma associação.

### Product e ProductVariant

| Product | | |
|---------|------|-----------|
| type | String | Oleo, Topico, Capsula, Gummy, Flor |
| category | String | Oleo CBD, Oleo THC, Oleo Misto, Oleo Especial, Pomada, Creme, Capsula, Gummy, Flor |
| concentration | String? | Ex: "15mg/ml" |
| cbd, thc | Float | Concentrações |

| ProductVariant | | |
|----------------|------|-----------|
| volume | String | Ex: "30ml", "10ml" |
| price | Decimal | Preço (10,2) |

Um Product tem N variantes (volumes/preços diferentes).

## RBAC — Modelo de permissões

```
User ──(N:N)── Role ──(N:N)── Permission
       via           via
    UserRole    RolePermission
```

### Roles

| Role | Level | Descrição |
|------|-------|-----------|
| admin | 100 | Acesso total ao painel administrativo |
| association | 50 | Acesso ao painel da associação vinculada |

Pacientes não têm role — o acesso é controlado por `accountType` e `accountStatus`.

### Permissões

| Recurso | Ações | Quem usa |
|---------|-------|----------|
| admin_users | read, update | admin |
| admin_documents | read, update | admin |
| association_catalog | read, create, update, delete | association |
| association_members | read, update | association |
| association_profile | read, update | association |

## Ciclo de vida do paciente

```
1. Cadastro
   User criado com:
   - accountStatus: "pending"
   - onboardingStatus: "not_started"
   - documentsStatus: "not_submitted"

2. Onboarding (acolhimento)
   - Start → onboardingStatus: "in_progress"
   - Complete → onboardingStatus: "completed"

3. Upload de documentos
   - Envio → documentsStatus: "pending_review"

4. Aprovação (admin)
   - Docs aprovados → documentsStatus: "approved"
   - Admin aprova user → accountStatus: "approved"

5. Acesso completo
   - Preços visíveis no catálogo
   - Pode solicitar vínculo com associação
```

## Invariantes do domínio

1. **Email é único** — tentativa de registro duplicado retorna 409
2. **CPF é único** — quando preenchido, não pode duplicar
3. **OnboardingSession é 1:1 com User** — não pode ter duas sessões
4. **Patient é criado sob demanda** — só existe quando há vínculo
5. **PatientAssociationLink é único por par** (patient + association) — implementado via lógica no use case
6. **Cascade de documentos** — aprovação/rejeição de um doc pode alterar `documentsStatus` do User
7. **Use cases retornam Either** — nunca lançam exceções, o controller mapeia Left → HTTP error
8. **JwtAuthGuard não é global** — cada controller declara seus guards explicitamente
