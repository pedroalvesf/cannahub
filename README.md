# CannHub

Plataforma que conecta pacientes de cannabis medicinal a associações brasileiras. Três lados: pacientes, associações e administração. O diferencial é viabilizar o acesso real ao medicamento com segurança jurídica e documental.

## Visão geral

O paciente se cadastra, preenche seu perfil clínico (onboarding), envia documentos (receita, laudo, identidade, comprovante de residência) e, após aprovação, pode acessar o catálogo de produtos das associações parceiras, solicitar vínculos e acompanhar tudo pelo painel.

As associações gerenciam seus produtos, aprovam/rejeitam solicitações de vínculo e configuram anuidades. O admin aprova cadastros e documentos.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Backend | NestJS, TypeScript, PostgreSQL, Prisma |
| Frontend | React 19, Vite, Tailwind CSS, Zustand, React Query |
| Auth | JWT + Passport, RBAC com roles hierárquicas |
| Infra | Docker (Postgres + Redis), pnpm workspaces |

## Estrutura do monorepo

```
cannahub/
├── apps/
│   ├── api/         # NestJS — Clean Architecture + DDD
│   └── web/         # React 19 + Vite + Tailwind
├── packages/
│   └── shared/      # Tipos, enums, schemas Zod compartilhados
├── docker-compose.yml          # Dev: Postgres (:5432) + Redis (:6379)
└── pnpm-workspace.yaml
```

## Pré-requisitos

- Node.js >= 20
- pnpm >= 9
- Docker e Docker Compose

## Setup

```bash
# 1. Instalar dependências
pnpm install

# 2. Subir Postgres e Redis
docker compose up -d

# 3. Criar arquivo de variáveis de ambiente
cp apps/api/.env.example apps/api/.env
# Editar .env com as credenciais corretas (ver seção abaixo)

# 4. Gerar Prisma client
cd apps/api && pnpm prisma:generate

# 5. Sincronizar schema com o banco
npx prisma db push

# 6. (Opcional) Rodar seeds
npx tsx prisma/seed-admin-user.ts           # Admin: adm@teste.com / 123456
npx tsx prisma/seed-association-user.ts      # Associação: associacaoalianca@teste.com / 123456
npx tsx prisma/seed-products.ts              # 12 produtos da Aliança Medicinal
npx tsx prisma/seed-doctors.ts               # 6 médicos no diretório público (/medicos)
```

## Variáveis de ambiente

**apps/api/.env**
```
DATABASE_URL="postgresql://cannahub_user:cannahub_password@localhost:5432/cannahub_db"
JWT_SECRET="cannahub-dev-jwt-secret-key-min-32-chars"
SECRET_ENCRYPTION_KEY="cannahub-dev-encryption-key-min-32-chars"
PORT=3000
```

## Rodando

```bash
# API (porta 3000)
cd apps/api && pnpm dev

# Frontend (porta 5173, proxy /api → :3000)
cd apps/web && pnpm dev
```

Acesse http://localhost:5173

## Testes

```bash
# Unit tests (140 testes)
cd apps/api && pnpm test

# E2E tests (22 testes — precisa do Postgres de teste rodando)
cd apps/api
docker compose -f docker-compose.test.yml up -d
pnpm test:e2e

# Frontend (type-check + build)
cd apps/web && pnpm build
```

## Usuários de teste (seeds)

| Email | Senha | Tipo | Acesso |
|-------|-------|------|--------|
| adm@teste.com | 123456 | Admin | /admin/* |
| associacaoalianca@teste.com | 123456 | Associação | /associacao/* |

Pacientes são criados pelo fluxo de cadastro em /cadastro.

## Fluxo do paciente

```
Cadastro → Acolhimento (perfil clínico) → Documentos (upload) → Painel
                                                                   ↓
                                              Associações → Catálogo (preços após aprovação)
                                                                   ↓
                                              Diário de tratamento (humor, sintomas, medicação)
                                                                   ↓
                                              Diretório de médicos (encontrar prescritor)
```

## Tipos de usuário

| Tipo | Acesso |
|------|--------|
| Paciente | /painel, /acolhimento, /documentos, /associacoes |
| Responsável Legal | Idem (gerencia dependentes) |
| Cuidador | Idem |
| Prescritor | Futuro |
| Veterinário | Futuro |
| Associação | /associacao/* (painel, produtos, associados, perfil) |
| Admin | /admin/* (aprovação de usuários e documentos) |

## Roadmap

- **Fase 1 — MVP**: Concluída (auth, cadastro, onboarding, documentos, catálogo, tratamentos, legislação, admin)
- **Fase 1.5 — Painel da Associação**: Concluída (CRUD produtos, gestão de vínculos, anuidade, perfil)
- **Fase 2 — Conteúdo**: em andamento
  - ✅ Catálogo público via API real (`GET /associations/:id/products`)
  - ✅ Diretório de médicos (`/medicos`, `/medicos/:slug`)
  - ✅ Diário de tratamento do paciente (`/diario`)
  - ⏳ Upload real via S3
  - ⏳ Blog, diretório de advogados, eventos, SEO
- **Fase 3 — Transação**: Pagamento com split, pedidos, inteligência de mercado

## Documentação

- `CLAUDE.md` — Referência geral do projeto (regras, endpoints, design system, roadmap)
- `apps/api/CLAUDE.md` — Referência do backend (arquitetura, padrões, testes)
- `apps/web/CLAUDE.md` — Referência do frontend (rotas, hooks, design system)
- `DOMAIN_MODEL.md` — Modelo de domínio e relacionamentos entre entidades
- `DOCS.md` — Documentação técnica detalhada (APIs, fluxos, regras de negócio)
