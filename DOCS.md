# CannHub — Documentação Técnica

## Sumário

- [Arquitetura](#arquitetura)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Endpoints da API](#endpoints-da-api)
- [Fluxos de Negócio](#fluxos-de-negócio)
- [Frontend](#frontend)
- [Testes](#testes)
- [Seeds e Dados de Teste](#seeds-e-dados-de-teste)
- [Deploy e Infraestrutura](#deploy-e-infraestrutura)

---

## Arquitetura

### Backend (apps/api)

Segue Clean Architecture + DDD:

```
src/
├── core/                       # Primitivas: Entity, Either, UniqueEntityID, WatchedList
├── domain/
│   ├── auth/                   # Identidade e RBAC
│   │   ├── enterprise/entities/    # User, Role, Permission, Device, RefreshToken
│   │   └── application/
│   │       ├── use-cases/          # 16+ use cases
│   │       ├── repositories/       # Interfaces abstratas
│   │       └── cryptography/       # Abstrações de hash/encrypt
│   ├── onboarding/             # Perfil clínico
│   │   ├── enterprise/entities/    # OnboardingSession, SupportTicket
│   │   └── application/use-cases/  # start, submit-step, complete, etc.
│   ├── association/            # Associações, produtos, vínculos
│   │   ├── enterprise/entities/    # Association, Product, PatientAssociationLink
│   │   └── application/use-cases/  # CRUD produtos, membros, links, perfil
│   └── admin/                  # Aprovação de usuários e documentos
│       └── application/use-cases/  # list-users, approve/reject docs, etc.
├── infra/
│   ├── auth/                   # JWT strategy, guards, decorators
│   ├── cryptography/           # Bcrypt, JWT, AES (implementações)
│   ├── database/prisma/        # Repositories Prisma + mappers
│   ├── http/controllers/       # Controllers NestJS + DTOs
│   └── env/                    # Validação de variáveis de ambiente (Zod)
└── generated/prisma/           # Prisma client (gerado, gitignored)
```

### Either pattern

Use cases nunca lançam exceções. Retornam `Either<ErrorType, { result }>`:

```typescript
const result = await useCase.execute({ ... })
if (result.isLeft()) {
  // Mapear erro para HTTP status
  const error = result.value
  throw new ConflictException(error.message)
}
const { user } = result.value
```

### Repository pattern

Use cases dependem de classes abstratas (interfaces). O NestJS DI resolve para implementações Prisma em runtime. Testes usam implementações in-memory.

### Frontend (apps/web)

React 19 com Vite. Estado global via Zustand (auth, theme). Chamadas à API via React Query + Axios.

```
src/
├── components/         # Layout (header), onboarding, UI
├── constants/labels.ts # Labels centralizados (nunca duplicar em páginas)
├── data/               # Dados estáticos (associações, produtos, tratamentos)
├── hooks/              # React Query mutations/queries
├── lib/api.ts          # Axios com interceptors (auth, device headers, refresh)
├── pages/              # 21 páginas (lazy loaded)
└── stores/             # Zustand (auth-store, theme-store)
```

---

## Autenticação e Autorização

### Fluxo de autenticação

1. **Registro** (`POST /auth/user`): cria User + Device + tokens (access + refresh)
2. **Login** (`POST /login`): valida credenciais, cria/reutiliza Device, gera tokens
3. **Acesso autenticado**: header `Authorization: Bearer <accessToken>`
4. **Refresh**: `POST /auth/refresh` com refreshToken no body → novo accessToken
5. **Logout**: `POST /logout/:userId` → revoga todos os devices e tokens

### Device tracking

Toda requisição de login/registro exige headers de dispositivo:
- `x-ipaddress` (obrigatório)
- `x-operatingsystem`
- `x-browser`
- `x-type` (desktop, mobile, tablet)

### RBAC

O sistema usa roles hierárquicas com permissões granulares:

```
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('admin_users:read')
@Get('/admin/users')
```

**JwtAuthGuard não é global** — cada controller precisa declarar `@UseGuards(JwtAuthGuard)` ou `@Public()`.

Endpoints públicos usam o decorator `@Public()` (importado de `@/infra/auth/public`).

### Tokens

- **AccessToken**: JWT, curta duração
- **RefreshToken**: armazenado no banco, vinculado ao Device, revogável

---

## Endpoints da API

### Auth (públicos)

| Método | Rota | Body | Retorno |
|--------|------|------|---------|
| POST | `/auth/user` | `{ email, password, name?, accountType? }` + device headers | `{ accessToken, refreshToken, user }` |
| POST | `/login` | `{ email, password }` + device headers | `{ accessToken, refreshToken, user }` |
| POST | `/auth/refresh` | `{ refreshToken }` | `{ accessToken }` |

### Auth (autenticados)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/auth/me` | Dados do user logado (com roles e status granulares) |
| PUT | `/auth/profile` | Atualizar name, phone, cpf |
| DELETE | `/auth/user/:id` | Deletar conta |
| POST | `/logout/:userId` | Revogar todos os devices |
| DELETE | `/revoke-device-session` | Revogar sessão específica |

### Onboarding (autenticados)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/onboarding/start` | Inicia sessão (→ onboardingStatus: in_progress) |
| PATCH | `/onboarding/step` | Submete step `{ stepNumber, data }` |
| POST | `/onboarding/complete` | Completa (→ onboardingStatus: completed) |
| GET | `/onboarding/summary` | Resumo do perfil clínico |
| POST | `/onboarding/escalate` | Escala para atendente humano |
| POST | `/onboarding/extract` | Extrai campos clínicos de texto livre |

### Associações (públicos)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/associations` | Lista com filtros: region, state, hasAssistedAccess |
| GET | `/associations/:id` | Detalhe da associação |
| GET | `/associations/:id/product-types` | Tipos de produto disponíveis |

### Vínculos (autenticados)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/associations/:id/link` | Solicitar vínculo (cria Patient se não existir) |
| GET | `/my-links` | Vínculos do paciente logado (com nome da associação) |

### Documentos (autenticados)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/documents` | Lista documentos do user logado |

### Painel da Associação (role: association)

| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/association/dashboard` | profile:read | Métricas (membros, pendentes, produtos) |
| GET | `/association/products` | catalog:read | Listar produtos + variantes |
| POST | `/association/products` | catalog:create | Criar produto + variantes |
| PATCH | `/association/products/:id` | catalog:update | Atualizar produto |
| DELETE | `/association/products/:id` | catalog:delete | Excluir produto |
| GET | `/association/members` | members:read | Listar vínculos (filtro por status) |
| PATCH | `/association/members/:id/approve` | members:update | Aprovar vínculo |
| PATCH | `/association/members/:id/reject` | members:update | Rejeitar vínculo |
| DELETE | `/association/members/:id` | members:update | Cancelar membro ativo |
| GET | `/association/profile` | profile:read | Perfil da associação |
| PATCH | `/association/profile` | profile:update | Atualizar perfil + config anuidade |

### Admin (role: admin)

| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/admin/users` | users:read | Lista com filtros, busca, paginação |
| GET | `/admin/users/:id` | users:read | Detalhe (user + onboarding + docs) |
| PATCH | `/admin/users/:id/status` | users:update | Aprovar/rejeitar paciente |
| DELETE | `/admin/users` | users:update | Exclusão em massa `{ userIds }` |
| PATCH | `/admin/documents/:id/approve` | documents:update | Aprovar documento |
| PATCH | `/admin/documents/:id/reject` | documents:update | Rejeitar `{ reason }` |

### RBAC (autenticados)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/roles` | Criar role |
| GET | `/roles` | Listar roles |
| POST | `/roles/assign` | Atribuir role a user |
| DELETE | `/roles/remove` | Remover role de user |
| POST | `/permissions` | Criar permissão |
| GET | `/permissions` | Listar permissões |

---

## Fluxos de Negócio

### Cadastro de paciente

1. User escolhe tipo de conta (patient, guardian, caregiver, prescriber, veterinarian)
2. Preenche email, senha, nome
3. Sistema cria User com `accountStatus: "pending"`, `onboardingStatus: "not_started"`
4. Login automático (tokens retornados na resposta)
5. Redirect para `/acolhimento`

### Onboarding (acolhimento clínico)

6 steps (o step 3 é condicional):

| Step | Campo | Tipo | Condicional? |
|------|-------|------|-------------|
| 1 | condition | Multi-select | Não |
| 2 | experience | Single-select | Não |
| 3 | currentAccessMethod | Single-select | Sim (experience !== 'never') |
| 4 | hasPrescription | Single-select | Não |
| 5 | preferredForm | Multi-select | Não |
| 6 | assistedAccess | Single-select | Não |

Multi-select armazena valores como string separada por vírgula: `"anxiety,depression,insomnia"`.

### Upload de documentos

4 tipos obrigatórios:
- Receita médica (`medical_prescription`)
- Laudo médico (`medical_report`)
- Identidade RG/CNH (`identity_document`)
- Comprovante de residência (`proof_of_residence`)

Após envio: `documentsStatus → "pending_review"`.

### Aprovação (admin)

O admin acessa `/admin/usuarios`, visualiza o detalhe de cada paciente (dados, onboarding, docs) e pode:
- Aprovar/rejeitar cada documento individualmente
- Aprovar/rejeitar o paciente (`accountStatus`)

**Cascade de documentos**: ao aprovar o último doc pendente, `documentsStatus` vira `"approved"` automaticamente. Ao rejeitar qualquer doc, vira `"rejected"`.

### Vínculo com associação

1. Paciente com `accountStatus: "approved"` acessa página da associação
2. Clica "Solicitar Vínculo"
3. Backend cria Patient (se não existir) + PatientAssociationLink com `status: "requested"`
4. Operador da associação vê no painel (`/associacao/associados`) e aprova/rejeita
5. Se aprovado, feeStatus pode ser configurado (pending, paid, exempt)

**Regra**: vínculo é opcional para ver preços. Conta aprovada é suficiente.

### Gestão de produtos (associação)

Operadores da associação acessam `/associacao/produtos`:
- Criar produto com nome, tipo, categoria, concentração, CBD/THC, variantes (volume + preço)
- Editar inline (altera produto e substitui variantes)
- Excluir produto
- Produtos aparecem no catálogo público da associação

---

## Frontend

### Guards de rota

| Guard | Verifica | Redirect |
|-------|----------|----------|
| ProtectedRoute | `isAuthenticated` | → /cadastro |
| AssociationRoute | `isAuthenticated` + `roles.includes('association')` | → /painel |
| AdminRoute | `isAuthenticated` + `roles.includes('admin')` | → /painel |

### Controle de acesso por status

| Status | Catálogo | Vínculo | Mensagem |
|--------|----------|---------|----------|
| Não logado | Sem preços | Bloqueado | "Criar conta" |
| Pendente | Sem preços | Bloqueado | "Cadastro incompleto" |
| Rejeitado | Sem preços | Bloqueado | "Cadastro recusado" |
| Aprovado | Com preços | Liberado | — |

### Interceptors do Axios (lib/api.ts)

- **Request**: adiciona Bearer token se logado; envia device headers em rotas de auth
- **Response**: intercepta 401, tenta refresh token automático, redireciona para /login se falhar

### Labels centralizados

Arquivo `src/constants/labels.ts` contém todos os mapas de exibição:
- ACCOUNT_TYPE_LABELS, ACCOUNT_STATUS_LABELS
- CONDITION_LABELS, EXPERIENCE_LABELS
- DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS
- Badge colors por status
- `formatMultiSelect()` para campos multi-valor

**Regra**: nunca duplicar labels em páginas. Sempre importar de labels.ts.

---

## Testes

### Unit tests (123 — Vitest)

Usam implementações in-memory dos repositories, fake crypto e fake AI. Sem banco de dados.

```bash
cd apps/api && pnpm test
```

Cada use case tem seu arquivo de teste em `use-cases/tests/*.spec.ts`. Factories disponíveis:
- `makeUser()`, `makeRole()`, `makePermission()`
- `makeDevice()`, `makeOnboardingSession()`
- `makeDocument()`, `makeAssociation()`, `makeProduct()`

### E2E tests (22 — Vitest + Supertest)

Rodam contra Postgres real (porta 8239). O `setup-e2e.ts` executa `prisma db push` antes dos testes.

```bash
cd apps/api
docker compose -f docker-compose.test.yml up -d
pnpm test:e2e
```

### Frontend

Não há testes unitários de componentes. A validação é feita por type-check + build:

```bash
cd apps/web && pnpm build
```

---

## Seeds e Dados de Teste

### Admin

```bash
cd apps/api
npx tsx prisma/seed-admin-user.ts
```

Cria:
- User `adm@teste.com` / `123456`
- Role `admin` (level 100)
- Permissões: admin_users:read, admin_users:update, admin_documents:read, admin_documents:update
- Atribui role ao user

### Associação

```bash
npx tsx prisma/seed-association-user.ts
```

Cria:
- User `associacaoalianca@teste.com` / `123456`
- Association "Aliança Medicinal" (ID fixo: `a1b2c3d4-...`)
- Role `association` (level 50)
- Permissões: association_catalog:*, association_members:*, association_profile:*
- AssociationMember vinculando user à associação

### Produtos

```bash
npx tsx prisma/seed-products.ts
```

Cria 12 produtos da Aliança Medicinal com variantes (óleos, tópicos, cápsulas, gummies, flores).

### Promover user existente

```bash
# Promover para admin
npx tsx prisma/seed-admin.ts email@exemplo.com

# Promover para association (com ID da associação)
npx tsx prisma/seed-association-user.ts email@exemplo.com associationId
```

---

## Deploy e Infraestrutura

### Docker Compose — Dev (raiz)

```bash
docker compose up -d
```

| Container | Porta | Credenciais |
|-----------|-------|-------------|
| cannahub-postgres | 5432 | cannahub_user:cannahub_password / cannahub_db |
| cannahub-redis | 6379 | — |

### Docker Compose — Testes E2E

```bash
cd apps/api
docker compose -f docker-compose.test.yml up -d
```

| Container | Porta | Credenciais |
|-----------|-------|-------------|
| auth-postgres-test | 8239 | auth_test_user:auth_test_password / auth_test_db |

### Portas

| Serviço | Porta |
|---------|-------|
| API (dev) | 3000 |
| API (test) | 3001 |
| Frontend (Vite) | 5173 |
| Postgres (dev) | 5432 |
| Postgres (test) | 8239 |
| Redis | 6379 |

### Pendências de infraestrutura

- Upload de arquivos via S3 (atualmente apenas URL placeholder)
- CORS restrito (atualmente `origin: '*'`)
- Rate limiting no login
- Migração de JWT para httpOnly cookies
- CSP headers no frontend
