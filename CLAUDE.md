# CannHub — Referência do Projeto

## O que é

Plataforma que conecta pacientes de cannabis medicinal a associações brasileiras. Três lados: pacientes, associações e admin. O diferencial é viabilizar o acesso real ao medicamento com segurança jurídica e documental.

## Monorepo

```
cannahub/
├── apps/
│   ├── api/         # NestJS — Clean Architecture + DDD
│   └── web/         # React 19 + Vite + Tailwind
├── packages/
│   └── shared/      # Tipos, enums, schemas Zod compartilhados (19 enums)
├── docker-compose.yml          # Dev: Postgres (:5432) + Redis (:6379)
└── pnpm-workspace.yaml
```

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | NestJS + TypeScript, PostgreSQL + Prisma (adapter-pg) |
| Frontend | React 19 + Vite + Tailwind, Zustand + React Query |
| Auth | JWT + Passport, RBAC com roles hierárquicas + PermissionsGuard |
| AI | Anthropic Claude Haiku (extração de campos clínicos) |
| Infra | Docker (Postgres + Redis), bcryptjs para hashing |

## Regras de desenvolvimento

- **Sempre rodar testes antes de finalizar alterações**: `pnpm test` (unit) e `pnpm test:e2e` (e2e) no apps/api, `pnpm build` no apps/web
- **Labels centralizados**: toda label de exibição (status, tipos, condições) vive em `apps/web/src/constants/labels.ts` — nunca duplicar em páginas
- **Sem hacks**: não usar `hydrate()` como workaround, não duplicar campos (ex: `status` + `accountStatus`), não usar `as any`
- **RBAC no backend**: segurança vem de `@UseGuards(JwtAuthGuard, PermissionsGuard)` + `@RequirePermission()`, não de separação de projetos
- **Either pattern**: use cases retornam `Either<Error, Result>`, nunca lançam exceções

## Docker & Infraestrutura

### Dev (raiz: docker-compose.yml)
```bash
docker compose up -d              # Sobe Postgres + Redis
```
| Service | Container | Porta | Credenciais | DB |
|---------|-----------|-------|-------------|-----|
| postgres | cannahub-postgres | 5432 | cannahub_user:cannahub_password | cannahub_db |
| redis | cannahub-redis | 6379 | — | — |

### Testes E2E (apps/api/docker-compose.test.yml)
```bash
cd apps/api
docker compose -f docker-compose.test.yml up -d   # Sobe Postgres de teste
pnpm test:e2e                                      # Roda E2E (porta 8239)
```
| Service | Container | Porta | Credenciais | DB |
|---------|-----------|-------|-------------|-----|
| postgres-test | auth-postgres-test | 8239 | auth_test_user:auth_test_password | auth_test_db |

### Legacy (apps/api/docker-compose.yml) — NÃO usar para dev
Docker-compose antigo do projeto auth-min. Porta 8238. O dev usa o da raiz (porta 5432).

### Variáveis de ambiente

**apps/api/.env** (dev):
```
DATABASE_URL="postgresql://cannahub_user:cannahub_password@localhost:5432/cannahub_db"
JWT_SECRET="cannahub-dev-jwt-secret-key-min-32-chars"
SECRET_ENCRYPTION_KEY="cannahub-dev-encryption-key-min-32-chars"
PORT=3000
```

**apps/api/.env.test** (E2E):
```
DATABASE_URL="postgresql://auth_test_user:auth_test_password@localhost:8239/auth_test_db"
JWT_SECRET="test-jwt-secret-key-with-32-characters-minimum"
SECRET_ENCRYPTION_KEY="test-encryption-key"
PORT=3001
```

## Comandos

```bash
# Raiz
docker compose up -d              # Sobe Postgres + Redis

# API (cd apps/api)
pnpm dev                          # Dev server (port 3000)
pnpm build                        # Compile TypeScript
pnpm test                         # 93 unit tests (Vitest)
pnpm test:e2e                     # 22 E2E tests (precisa docker-compose.test.yml rodando)
pnpm prisma:generate              # Gera Prisma client
npx prisma db push                # Sync schema com DB

# Web (cd apps/web)
pnpm dev                          # Vite dev server (port 5173, proxy /api → :3000)
pnpm build                        # tsc + vite build
```

## Fluxo principal do paciente

```
Cadastro (/cadastro)  →  Acolhimento (/acolhimento)  →  Documentos (/documentos)  →  Painel (/painel)
  tipo de conta            perfil clínico (5-6 steps)     upload 4 docs                 visão consolidada
  + dados básicos          condição, experiência,         receita, laudo,               status cadastro,
  + login automático       [acesso atual*], receita,      RG/CNH, comprovante           perfil clínico,
                           forma de uso, assistido                                      docs, associações

* Step condicional: "Como você acessa cannabis atualmente?" — aparece só quando experiência !== 'never'
```

## Rotas do frontend (16 páginas)

| Rota | Página | Auth | Guard |
|------|--------|------|-------|
| `/` | Home (landing) | Não | — |
| `/quiz` | Triagem (4 perfis) | Não | — |
| `/cadastro` | Registro (2 steps: tipo + dados) | Não | — |
| `/login` | Login | Não | — |
| `/acolhimento` | Onboarding (5-6 steps, multi-select, condicional) | Sim | ProtectedRoute |
| `/documentos` | Upload de documentos | Sim | ProtectedRoute |
| `/painel` | Dashboard do paciente | Sim | ProtectedRoute |
| `/tratamentos` | Info científica sobre cannabis medicinal | Não | — |
| `/legislacao` | Legislação brasileira sobre cannabis medicinal | Não | — |
| `/catalogo` | Catálogo unificado (cepas + produtos) | Não | — |
| `/associacoes` | Associações credenciadas (11) | Não | — |
| `/associacoes/:slug` | Detalhe da associação | Não | — |
| `/associacoes/:slug/catalogo` | Catálogo da associação (preço restrito a aprovados) | Não | — |
| `/admin/usuarios` | Painel admin — lista de usuários | Sim | AdminRoute (role: admin) |
| `/admin/usuarios/:id` | Painel admin — detalhe do usuário | Sim | AdminRoute (role: admin) |

### Guards do frontend
- **ProtectedRoute**: verifica `isAuthenticated`, redireciona para `/cadastro`
- **AdminRoute**: verifica `isAuthenticated` + `user.roles.includes('admin')`, redireciona para `/painel`

## Endpoints da API

### Auth
- `POST /auth/user` — registro (público, retorna tokens + user)
- `POST /login` — login (público, retorna tokens + user)
- `GET /auth/me` — dados do user logado + roles + status granulares (JWT)
- `POST /auth/refresh` — refresh token (público)
- `DELETE /auth/user/:id` — deletar conta
- `POST /logout/:userId` — revogar todos devices
- `DELETE /revoke-device-session` — revogar sessão
- `PUT /auth/profile` — atualizar perfil (name, phone, cpf) (JWT)

### RBAC
- `POST /roles` — criar role
- `GET /roles` — listar roles
- `POST /roles/assign` — atribuir role
- `DELETE /roles/remove` — remover role
- `POST /permissions` — criar permissão
- `GET /permissions` — listar permissões

### Onboarding
- `POST /onboarding/start` — iniciar sessão (+ atualiza user.onboardingStatus → in_progress)
- `PATCH /onboarding/step` — submeter step (1-6, step 6 = currentAccessMethod condicional)
- `POST /onboarding/complete` — completar (+ atualiza user.onboardingStatus → completed)
- `GET /onboarding/summary` — resumo (inclui currentAccessMethod)
- `POST /onboarding/escalate` — escalar pra humano
- `POST /onboarding/extract` — extrair campos com IA

### Associations & Documents
- `GET /associations` — listar associações (@Public, filtros: region, state, hasAssistedAccess)
- `GET /associations/:id` — detalhe associação (@Public)
- `GET /documents` — listar documentos do user (JWT)

### Admin (requer role admin + permissões)
- `GET /admin/users` — listar usuários (filtros, busca, paginação) — `admin_users:read`
- `GET /admin/users/:id` — detalhe completo (user + onboarding + documents) — `admin_users:read`
- `PATCH /admin/users/:id/status` — aprovar/rejeitar paciente — `admin_users:update`
- `DELETE /admin/users` — excluir usuários em massa (body: `{ userIds }`) — `admin_users:update`
- `PATCH /admin/documents/:id/approve` — aprovar documento (cascade → documentsStatus) — `admin_documents:update`
- `PATCH /admin/documents/:id/reject` — rejeitar documento (body: `{ reason }`) — `admin_documents:update`

## RBAC — Roles e Permissões

### Roles existentes
| Role | Slug | Level | Descrição |
|------|------|-------|-----------|
| Admin | `admin` | 100 | Acesso ao painel de aprovação |

### Permissões existentes
| Permissão | Resource | Action |
|-----------|----------|--------|
| `admin_users:read` | admin_users | read |
| `admin_users:update` | admin_users | update |
| `admin_documents:read` | admin_documents | read |
| `admin_documents:update` | admin_documents | update |

### Seed do admin
```bash
cd apps/api
npx tsx prisma/seed-admin-user.ts          # Cria user adm@teste.com + role + permissões
npx tsx prisma/seed-admin.ts email@ex.com  # Promove user existente para admin
```

### Tipos de usuário (futuro RBAC)
| Tipo | accountType | Role (futuro) | Acesso |
|------|-------------|---------------|--------|
| Paciente | patient | patient | /painel, /acolhimento, /documentos |
| Responsável Legal | guardian | patient | Idem (gerencia dependentes) |
| Cuidador | caregiver | patient | Idem |
| Prescritor | prescriber | prescriber | Futuro: painel de prescrições |
| Veterinário | veterinarian | prescriber | Futuro: painel veterinário |
| Associação | — | association | Futuro: /associacao/painel |
| Admin CannHub | — | admin | /admin/* |

## Entidades principais (Prisma)

```
User → accountType, accountStatus, onboardingStatus, documentsStatus
       onboardingStatus: not_started | in_progress | completed
       documentsStatus: not_submitted | pending_review | approved | rejected
OnboardingSession → perfil clínico (condition, experience, currentAccessMethod, preferredForm, hasPrescription, assistedAccess)
Document → tipo, URL S3, status (pending/approved/rejected), motivo rejeição, reviewedBy
Association → perfil, região, produtos, acesso assistido
Patient, Dependent, ProfessionalProfile → domínio de pacientes
PatientAssociationLink → vínculo paciente-associação
Role → name, slug, level, assignableRoles
Permission → name, slug, resource, action
UserRole → userId + roleId (junction)
RolePermission → roleId + permissionId (junction)
```

## Frontend — Arquitetura

### Labels centralizados
**Arquivo**: `apps/web/src/constants/labels.ts`

Contém TODOS os mapas de labels (ACCOUNT_TYPE_LABELS, CONDITION_LABELS, etc.), a função `formatMultiSelect()`, e as cores de badges. Nunca duplicar em páginas.

### Auth Store (Zustand)
**Arquivo**: `apps/web/src/stores/auth-store.ts`

Interface `User`: `{ id, email, name?, accountType?, accountStatus?, onboardingStatus?, documentsStatus?, verificationStatus?, phone?, cpf?, roles? }`

Fluxo de login:
1. `POST /login` → recebe tokens
2. `GET /auth/me` → recebe perfil completo (com roles)
3. `store.login()` → salva tudo de uma vez

### Hooks (React Query)
| Hook | Arquivo | Endpoints |
|------|---------|-----------|
| useLogin, useRegister | use-auth.ts | POST /login, POST /auth/user, GET /auth/me |
| useOnboardingSummary, etc. | use-onboarding.ts | GET/POST/PATCH onboarding/* |
| useUpdateProfile | use-profile.ts | PUT /auth/profile |
| useAddress, useSaveAddress | use-address.ts | GET/PUT /auth/address |
| useAdminUsers, useAdminUserDetail, useApproveDocument, useRejectDocument, useUpdateUserStatus, useDeleteUsers | use-admin.ts | GET/PATCH/DELETE /admin/* |

## Design System — "Rota 1 Lightized"

### Fontes
- **Headlines/Logo**: DM Serif Display (serif)
- **Body/UI**: DM Sans

### Paleta
```
green-deep: #243D2C    green-mid: #3A6647    green-light: #5A9468    green-pale: #D4E8DA
cream: #F4EFE4         cream-dark: #E5DDC9   sand: #C8BFA8
text: #1C2B21          text-muted: #607060   white: #FDFCF9
```

### Padrões visuais
- Navbar full-width fixa, `backdrop-blur`, `max-w-[1100px]`
- Logo: folha rotacionada (`rounded-[80%_0_80%_0] rotate-[15deg]`) + serif
- Ícones: SVG inline `strokeWidth="1.3"` (Feather/Lucide)
- Botões: `rounded-btn` (pill), sombras leves
- Páginas com Header: `pt-[80px]`, Home: `pt-[100px]`
- Cards list-style para seleção (não cards coloridos individuais)

## Regras de negócio importantes

- **accountType vive só no User** — coletado no cadastro, NÃO duplicado na OnboardingSession
- **Preços no catálogo**: visíveis apenas para `accountStatus === 'approved'`
- **Vínculo com associação**: opcional — algumas associações não exigem vínculo/taxa, basta conta aprovada
- **Documentos**: associação nunca vê — só admin
- **Onboarding multi-select**: condições e formas de uso aceitam múltiplas seleções (armazenadas como string separada por vírgula)
- **JwtAuthGuard NÃO é global** — cada controller precisa `@UseGuards(JwtAuthGuard)` ou `@Public()`
- **Sync de status**: StartOnboarding → onboardingStatus='in_progress', CompleteOnboarding → onboardingStatus='completed'
- **Cascade de docs**: ApproveDocument verifica se todos docs do user estão aprovados → documentsStatus='approved'; RejectDocument → documentsStatus='rejected'

## Testes

### Unit tests (93 — Vitest)
```bash
cd apps/api && pnpm test
```
Usam in-memory repositories + factories (makeUser, makeDocument, etc.). Sem banco.

### E2E tests (22 — Vitest + Supertest)
```bash
cd apps/api
docker compose -f docker-compose.test.yml up -d   # Primeiro: sobe Postgres teste
pnpm test:e2e
```
Requerem Postgres na porta 8239. `setup-e2e.ts` roda `prisma db push` antes dos testes.

### Frontend
```bash
cd apps/web && pnpm build    # Type-check + Vite build (verifica compilação)
```

## Roadmap

### Fase 1 — MVP (atual)
Auth, cadastro, onboarding, documentos, catálogo por associação, tratamentos, legislação, dashboard paciente, painel admin de aprovação

### Fase 2 — Conteúdo
Blog, diretório advogados, eventos, SEO, auto-cadastro associações

### Fase 3 — Transação
Pagamento com split (iugu), pedidos, inteligência de mercado

## Próximos passos

### Frontend
- [x] Perfil individual da Associação — `/associacoes/:slug`
- [x] Conectar Quiz → Cadastro (passar tipo via URL param)
- [x] Responsividade mobile (menu hamburger)
- [x] CTAs contextuais (serviços CannHub)
- [x] Step condicional no onboarding
- [x] Catálogo por associação com controle de acesso
- [x] Página de tratamentos com referências científicas
- [x] Multi-select no onboarding
- [x] Scroll to top em navegação
- [x] Página de legislação (/legislacao)
- [x] Painel admin de aprovação (/admin/usuarios)
- [x] Exclusão de usuários em massa (admin)
- [x] Labels centralizados (constants/labels.ts)
- [ ] Upload real de documentos (S3)
- [ ] Integrar catálogo com API real (substituir sample-products.ts)

### Backend
- [x] Controllers: associations (list, get by id), documents (list), update profile
- [x] Status granulares: onboardingStatus, documentsStatus no User
- [x] Painel admin: list, detail, approve/reject docs, approve/reject user, delete
- [x] Seed de permissões e user admin
- [ ] Módulos completos: strains, products, memberships
- [ ] Endpoint de vínculo com associação (POST /associations/:id/link)
- [ ] Notificações por e-mail (Resend)
- [ ] Upload S3 com URLs assinadas
- [ ] Seed de dados (associações reais: Aliança Medicinal, AMME Medicinal)
