# CannHub API — Referência Backend

## Comandos

```bash
pnpm dev                # Dev server (port 3000)
pnpm build              # Compile TypeScript (nest build --tsc)
pnpm test               # Unit tests — 71 passando (vitest run --project unit)
pnpm test:watch         # Watch mode
pnpm test:e2e           # E2E (precisa Postgres na porta 8239)
pnpm lint               # ESLint fix
pnpm format             # Prettier fix
pnpm prisma:generate    # Gera Prisma client (obrigatório antes de build/test)
pnpm prisma:migrate     # Run migrations
npx prisma db push      # Sync schema direto (dev rápido)
```

## Arquitetura

```
src/
├── core/                       # Entity, Either<L,R>, UniqueEntityID, WatchedList, DomainEvents
├── domain/
│   ├── auth/
│   │   ├── enterprise/entities/    # User, Role, Permission, Device, RefreshToken
│   │   └── application/
│   │       ├── use-cases/          # 16+ use cases com tests/ subfolder
│   │       ├── repositories/       # Interfaces abstratas
│   │       └── cryptography/       # HashGenerator, Encrypter, etc.
│   └── onboarding/
│       ├── enterprise/entities/    # OnboardingSession, SupportTicket, SupportMessage, Doctor
│       └── application/
│           ├── use-cases/          # start, submit-step, complete, get-summary, escalate, extract
│           ├── repositories/       # OnboardingSessionsRepository, etc.
│           └── ai/                 # AiExtractor (interface abstrata)
├── infra/
│   ├── auth/                   # JWT strategy, guards, @Public, @CurrentUser
│   ├── cryptography/           # Bcrypt (bcryptjs), JWT, AES
│   ├── database/prisma/        # Repos Prisma + mappers
│   ├── http/controllers/       # Controllers + DTOs
│   ├── ai/                     # Claude Haiku implementation + prompts
│   ├── env/                    # Validação Zod de env vars
│   └── logging/                # Winston
└── generated/prisma/           # Prisma client (git-ignored)

test/
├── repositories/       # In-memory implementations
├── factories/          # makeUser, makeRole, makeDevice, makeOnboardingSession...
├── cryptography/       # FakeEncrypter, FakeHashComparer
├── ai/                 # FakeAiExtractor
└── e2e/                # Supertest specs
```

## Padrões obrigatórios

### Either pattern
Use cases retornam `Either<ErrorType, { result }>`. Nunca lançam exceções.
```ts
const result = await useCase.execute({ ... })
if (result.isLeft()) {
  // mapear para HTTP error
}
const { user } = result.value as { user: User }
```

### Repository pattern
Use cases dependem de classes abstratas. NestJS DI resolve para Prisma. Testes usam in-memory.

### Mappers (Prisma)
Cada repo tem mapper com `toDomain()`, `toPrismaCreate()`, `toPrismaUpdate()` separados.

### WatchedList
Rastreia mutações em coleções (ex: RoleList do User). Persiste apenas diffs.

## Auth — regras críticas

- **JwtAuthGuard NÃO é global** — cada controller precisa `@UseGuards(JwtAuthGuard)` explícito
- Endpoints públicos usam `@Public()` (importar de `@/infra/auth/public`)
- Device tracking: login/register exigem headers `x-ipaddress`, `x-operatingsystem`, `x-browser`, `x-type`
- Hashing usa `bcryptjs` (não `bcrypt` nativo — incompatível com Node 22)

## Endpoints

### Auth
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/user` | @Public | Registro (retorna tokens + user) |
| POST | `/login` | @Public | Login (retorna tokens + user) |
| GET | `/auth/me` | JWT | Dados do user logado |
| POST | `/auth/refresh` | @Public | Refresh token |
| DELETE | `/auth/user/:id` | JWT | Deletar conta |
| POST | `/logout/:userId` | JWT | Revogar devices |

### Onboarding
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/onboarding/start` | JWT | Iniciar sessão |
| PATCH | `/onboarding/step` | JWT | Submeter step (1-5) |
| POST | `/onboarding/complete` | JWT | Completar |
| GET | `/onboarding/summary` | JWT | Resumo |
| POST | `/onboarding/escalate` | JWT | Escalar pra humano |
| POST | `/onboarding/extract` | JWT | Extrair campos com IA |

### RBAC
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/roles` | JWT | Criar role |
| GET | `/roles` | JWT | Listar roles |
| POST | `/roles/assign` | JWT | Atribuir role |
| POST | `/permissions` | JWT | Criar permissão |
| GET | `/permissions` | JWT | Listar permissões |

## Onboarding — 5 steps

1. **condition** — Condição de saúde principal
2. **experience** — Tempo de experiência com cannabis
3. **hasPrescription** — Tem receita médica?
4. **preferredForm** — Forma de uso preferida
5. **assistedAccess** — Precisa de acesso assistido?

`accountType` **NÃO** está no OnboardingSession — vive só no User (coletado no registro).

## Entidades Prisma relevantes

```
User              → accountType (patient/guardian/prescriber/veterinarian/caregiver)
OnboardingSession → condition, experience, preferredForm, hasPrescription, assistedAccess, summary
SupportTicket     → escalação de onboarding para humano
Document          → tipo, URL S3, status (pending/approved/rejected), motivo rejeição
Association       → perfil, região, produtos
Patient/Dependent → domínio de pacientes
PatientAssociationLink → vínculo paciente-associação
```

## Testes

- Unit: `src/**/*.spec.ts` — in-memory repos + fake crypto/AI, sem DB
- E2E: `test/**/*.e2e-spec.ts` — PostgreSQL real, `setup-e2e.ts` executa `prisma db push`
- Factories: `makeUser()`, `makeOnboardingSession()`, etc. aceitam `Partial<Props>`
- Framework: Vitest (não Jest) — usar `vi.fn()` para mocks

## Path aliases

`@/*` → `src/*`, `@/test/*` → `test/*`

## Prisma client import

```ts
import { ... } from '@/generated/prisma/client'
// NÃO usar '@/generated/prisma'
```

## Adicionando um novo use case

1. Use case em `src/domain/<module>/application/use-cases/`
2. Erros em `use-cases/errors/`
3. Teste unitário em `use-cases/tests/*.spec.ts`
4. Controller em `src/infra/http/controllers/<module>/`
5. DTO em `src/infra/http/controllers/dto/`
6. Registrar use case + controller em `src/infra/http/http.module.ts`
