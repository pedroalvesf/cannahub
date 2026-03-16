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
│   └── shared/      # Tipos, enums, schemas Zod compartilhados
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | NestJS + TypeScript, PostgreSQL + Prisma |
| Frontend | React 19 + Vite + Tailwind, Zustand + React Query |
| Auth | JWT + Passport, RBAC com roles hierárquicas |
| AI | Anthropic Claude Haiku (extração de campos clínicos) |
| Infra | Docker (Postgres + Redis), bcryptjs para hashing |

## Comandos

```bash
# Raiz
docker compose up -d              # Sobe Postgres + Redis

# API (cd apps/api)
pnpm dev                          # Dev server (port 3000)
pnpm build                        # Compile TypeScript
pnpm test                         # 71 unit tests (Vitest)
pnpm prisma:generate              # Gera Prisma client
npx prisma db push                # Sync schema com DB

# Web (cd apps/web)
pnpm dev                          # Vite dev server (port 5173, proxy /api → :3000)
pnpm build                        # tsc + vite build
```

## Variáveis de ambiente (apps/api/.env)

```
DATABASE_URL="postgresql://cannahub_user:cannahub_password@localhost:5432/cannahub_db"
JWT_SECRET="<min-32-chars>"
SECRET_ENCRYPTION_KEY="<min-32-chars>"
PORT=3000
```

## Fluxo principal do paciente

```
Cadastro (/cadastro)  →  Acolhimento (/acolhimento)  →  Documentos (/documentos)  →  Painel (/painel)
  tipo de conta            perfil clínico (5 steps)       upload 4 docs                 visão consolidada
  + dados básicos          condição, experiência,         receita, laudo,               status cadastro,
  + login automático       receita, forma de uso,         RG/CNH, comprovante           perfil clínico,
                           acesso assistido                                             docs, associações
```

## Rotas do frontend (9 páginas)

| Rota | Página | Auth |
|------|--------|------|
| `/` | Home (landing) | Não |
| `/quiz` | Triagem (4 perfis) | Não |
| `/cadastro` | Registro (2 steps: tipo + dados) | Não |
| `/login` | Login | Não |
| `/acolhimento` | Onboarding (5 steps) | Sim |
| `/documentos` | Upload de documentos | Sim |
| `/painel` | Dashboard do paciente | Sim |
| `/catalogo` | Catálogo (cepas + produtos) | Não (preço restrito) |
| `/associacoes` | Associações credenciadas | Não (vínculo restrito) |

## Endpoints da API

### Auth
- `POST /auth/user` — registro (público, retorna tokens + user)
- `POST /login` — login (público, retorna tokens + user)
- `GET /auth/me` — dados do user logado (JWT)
- `POST /auth/refresh` — refresh token (público)
- `DELETE /auth/user/:id` — deletar conta
- `POST /logout/:userId` — revogar todos devices
- `DELETE /revoke-device-session` — revogar sessão

### RBAC
- `POST /roles` — criar role
- `GET /roles` — listar roles
- `POST /roles/assign` — atribuir role
- `DELETE /roles/remove` — remover role
- `POST /permissions` — criar permissão
- `GET /permissions` — listar permissões

### Onboarding
- `POST /onboarding/start` — iniciar sessão
- `PATCH /onboarding/step` — submeter step
- `POST /onboarding/complete` — completar
- `GET /onboarding/summary` — resumo
- `POST /onboarding/escalate` — escalar pra humano
- `POST /onboarding/extract` — extrair campos com IA

## Entidades principais (Prisma)

```
User → accountType vive aqui (patient/guardian/prescriber/veterinarian/caregiver)
OnboardingSession → perfil clínico (condition, experience, preferredForm, hasPrescription, assistedAccess)
                     NÃO tem accountType (removido, vive só no User)
Document → tipo, URL S3, status, motivo rejeição
Association → perfil, região, produtos, acesso assistido
Patient, Dependent, ProfessionalProfile → domínio de pacientes
PatientAssociationLink → vínculo paciente-associação
```

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
- **Preços**: visíveis apenas para `accountStatus === 'approved'`
- **Vínculo com associação**: restrito a aprovados
- **Documentos**: associação nunca vê — só admin
- **JwtAuthGuard NÃO é global** — cada controller precisa `@UseGuards(JwtAuthGuard)` ou `@Public()`

## Roadmap

### Fase 1 — MVP (atual)
Auth, cadastro, onboarding, documentos, catálogo, associações, dashboard paciente

### Fase 2 — Conteúdo
Blog, diretório advogados, eventos, SEO, auto-cadastro associações

### Fase 3 — Transação
Pagamento com split (iugu), pedidos, inteligência de mercado

## Próximos passos

### Frontend
- [ ] Perfil individual da Associação (detalhe ao clicar)
- [ ] Conectar Quiz → Acolhimento (passar tipo)
- [ ] Responsividade mobile (menu hamburger)
- [ ] Upload real de documentos (S3)
- [ ] Integrar catálogo com API real

### Backend
- [ ] Módulos documents, associations, strains, products, memberships
- [ ] Painel admin de aprovação de documentos
- [ ] Notificações por e-mail (Resend)
- [ ] Upload S3 com URLs assinadas
- [ ] Seed de dados
