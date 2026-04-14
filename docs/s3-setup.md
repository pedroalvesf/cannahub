# Setup do S3 para upload de documentos

Guia passo a passo para configurar a infraestrutura AWS S3 antes de implementarmos o upload real de documentos dos pacientes (receita, laudo, RG/CNH, comprovante de residência). Hoje o fluxo de upload em `/documentos` é mockado — depois dessa etapa ele grava os arquivos de verdade em um bucket privado.

> **Escopo**: este documento cobre apenas a configuração AWS + variáveis de ambiente. A implementação do código (endpoints, SDK, frontend) vem depois, quando as credenciais estiverem prontas.

---

## 1. Arquitetura do upload (como vai funcionar)

O arquivo **nunca passa pelo backend**. O fluxo é:

```
1. Usuário escolhe arquivo em /documentos
2. Frontend → API        POST /documents/presign-upload
                         body: { type, filename, contentType, size }
3. API valida (MIME, tamanho, JWT), gera uma presigned URL PUT
                         (válida por ~5 min, key único por user/tipo)
4. API → Frontend        { uploadUrl, fileKey }
5. Frontend → S3         PUT uploadUrl (binário do arquivo)
6. Frontend → API        POST /documents
                         body: { type, fileKey }
7. API cria o Document no Postgres apontando para fileKey
                         (não guarda URL pública — gera presigned GET sob demanda)
8. Admin revisando → API GET /documents/:id/download-url
                         retorna presigned GET válido por 1 min
```

**Vantagens**:
- Backend nunca carrega MB de arquivo — escalabilidade grátis
- Bucket é 100% privado; nenhum objeto é servido por URL pública
- URLs expiram rápido (5 min upload, 1 min download)

---

## 2. O que você precisa criar na AWS

### 2.1 Bucket S3

Abra o console AWS → S3 → **Create bucket**.

| Campo | Valor recomendado | Por quê |
|---|---|---|
| Bucket name | `cannhub-documents-dev` (para ambiente de desenvolvimento) | Nomes S3 são globais; pode ser que já exista, use um sufixo único se precisar. Crie um bucket separado `cannhub-documents-prod` quando for subir para produção. |
| Região | `sa-east-1` (São Paulo) | Menor latência para usuários no Brasil e mais confortável sob a LGPD (dados permanecem no país). Alternativa: `us-east-1` é ~40% mais barata se o custo for o principal critério. |
| Object Ownership | ACLs disabled (recommended) | Simplifica permissões — tudo via bucket policy + IAM |
| Block Public Access | **TODAS as 4 caixas marcadas** | Ninguém acessa nada sem presigned URL |
| Bucket Versioning | **Enable** | Proteção contra delete acidental; é possível restaurar |
| Default encryption | SSE-S3 (AES-256) | Grátis, obrigatório. Alternativa: SSE-KMS se precisar de chave dedicada (custo adicional) |
| Tags | `Project=CannHub`, `Environment=dev` | Para rastrear custos |

Clique **Create bucket**.

### 2.2 CORS do bucket

Sem CORS o frontend do Vite (`http://localhost:5173`) não consegue fazer PUT direto no S3.

No bucket criado → aba **Permissions** → seção **Cross-origin resource sharing (CORS)** → **Edit**. Cole:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://app.cannhub.com.br"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

> Adicione o domínio de produção quando houver. Nunca use `"AllowedOrigins": ["*"]`.

### 2.3 Lifecycle policy (opcional, mas recomendo)

Evita acumular lixo (uploads que o paciente nunca confirmou) e versões antigas que inflam a fatura.

Bucket → aba **Management** → **Create lifecycle rule**:

1. Nome: `clean-unconfirmed-uploads`
2. Escopo: aplicar à tag `uploaded=false` (vamos tagger uploads não confirmados no código depois)
3. Ação: **Expire current versions of objects** após **1 day**
4. Salvar

Segunda regra `archive-old-versions`:
1. Escopo: aplicar a todo o bucket
2. Ação: **Permanently delete noncurrent versions** após **90 days**

### 2.4 IAM user dedicado

**Nunca use sua conta root.** Crie um IAM user exclusivo para a API.

Console AWS → IAM → Users → **Create user**.

- User name: `cannhub-api-uploads`
- Provide user access to the AWS Management Console: **NÃO** (é só pra API)
- Permissions options: **Attach policies directly** → **Create policy**

No editor de política, cole:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowObjectOperationsOnCannhubBucket",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::cannhub-documents-dev/*"
    },
    {
      "Sid": "AllowListBucketForDebug",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::cannhub-documents-dev"
    }
  ]
}
```

**Troque o nome do bucket** se você usou um nome diferente. Se tiver bucket de prod, adicione um segundo ARN ou crie uma segunda policy para o user de prod.

Nome da policy: `CannhubS3UploadsDev`. Descrição: "Acesso mínimo ao bucket de documentos dev".

Volte ao wizard de criação do user, selecione a policy recém-criada, **Next → Create user**.

### 2.5 Access keys

Usuário criado → aba **Security credentials** → **Create access key** → **Application running outside AWS**.

Você vai receber **dois valores** que só aparecem uma vez:

- `Access key ID` (ex: `AKIA...`)
- `Secret access key` (ex: `wJalrXUt...`)

Salve **já** em um gerenciador de senhas (1Password, Bitwarden, iCloud Keychain). Se perder, é só gerar outra — não há como recuperar a antiga.

**Não cole no chat, não suba pro git, não mande por email.**

---

## 3. Variáveis de ambiente

Depois de criar o user e pegar as keys, adicione ao `apps/api/.env` local:

```bash
# Upload S3
AWS_REGION="sa-east-1"
AWS_S3_BUCKET="cannhub-documents-dev"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_UPLOAD_URL_EXPIRES_IN_SECONDS=300    # 5 min para upload
AWS_S3_DOWNLOAD_URL_EXPIRES_IN_SECONDS=60   # 1 min para admin baixar
AWS_S3_MAX_FILE_SIZE_BYTES=10485760         # 10 MB
```

O `.env` já está no `.gitignore`. Vou adicionar um `.env.example` com os nomes (sem valores) quando implementar.

Para produção (quando existir), criar um bucket `cannhub-documents-prod`, um IAM user `cannhub-api-uploads-prod` com policy apontando para o bucket de prod, e armazenar as keys no secret manager do host (Render, Fly, Railway, etc.) — **nunca** em arquivo comitado.

---

## 4. Como eu vou validar que está correto

Depois de você criar tudo isso, antes de escrever uma linha de código eu rodo um smoke test via AWS CLI:

```bash
aws configure --profile cannhub-dev
# (cola access key + secret quando perguntar)

# Teste 1: listar bucket
aws s3 ls s3://cannhub-documents-dev --profile cannhub-dev

# Teste 2: upload de um arquivo de teste
echo "hello" > test.txt
aws s3 cp test.txt s3://cannhub-documents-dev/test.txt --profile cannhub-dev

# Teste 3: download
aws s3 cp s3://cannhub-documents-dev/test.txt downloaded.txt --profile cannhub-dev

# Teste 4: delete
aws s3 rm s3://cannhub-documents-dev/test.txt --profile cannhub-dev
```

Se todos os 4 passarem, a policy está correta. Se der `AccessDenied`, volte e confira o ARN no JSON da policy.

Se você não tiver o AWS CLI instalado: `brew install awscli` (macOS) ou baixe de https://aws.amazon.com/cli/.

---

## 5. Custo estimado

Baseado em tráfego de MVP (100 pacientes, ~4 docs cada, ~2 MB médio):

| Item | Volume | Preço (sa-east-1) | Custo mensal |
|---|---|---|---|
| Storage | ~800 MB | $0,0405 / GB | **$0,03** |
| PUT requests | ~500/mês | $0,0054 / 1k | $0,00 |
| GET requests | ~2k/mês (admin revisando) | $0,00043 / 1k | $0,00 |
| Transferência OUT | ~2 GB | $0,15 / GB | **$0,30** |
| **Total** | — | — | **~$0,35/mês** |

Mesmo escalando para 10k pacientes continua abaixo de $10/mês. S3 praticamente não é fator de custo na escala do MVP.

---

## 6. Riscos e mitigações que já vou cuidar no código

| Risco | Mitigação |
|---|---|
| Access key vazar | IAM user com policy mínima — mesmo se vazar, atacante só consegue PUT/GET/DELETE nesse bucket. Rotacionar keys a cada 90 dias. |
| Upload de arquivo gigante | Presigned URL vai incluir `content-length-range: [1, 10485760]` — S3 rejeita no próprio PUT se passar de 10 MB. |
| MIME spoofing (`.exe` renomeado pra `.pdf`) | Backend valida `contentType` no presign + checa magic bytes do arquivo após confirmação. Lista permitida: `application/pdf`, `image/jpeg`, `image/png`. |
| Documento listado publicamente | Block Public Access ON + policy nunca permite `s3:GetObject` sem autenticação. Só presigned URLs, e elas expiram rápido. |
| Lixo acumulando | Lifecycle policy: uploads não confirmados (tag `uploaded=false`) vão pro delete em 24h. |
| Admin vê URL crua do doc no frontend | Admin também usa presigned GET. URL nunca é persistida no frontend; é gerada quando ele abre o detalhe do paciente. |

---

## 7. Checklist antes de eu começar a implementar

Quando você tiver tudo isso pronto, me avise e eu começo o código:

- [ ] Bucket `cannhub-documents-dev` criado em `sa-east-1`
- [ ] Block Public Access: todas as 4 caixas marcadas
- [ ] Versioning habilitado
- [ ] CORS configurado (permitindo localhost:5173 pelo menos)
- [ ] IAM user `cannhub-api-uploads` criado
- [ ] Policy `CannhubS3UploadsDev` anexada ao user
- [ ] Access key gerada e salva no gerenciador de senhas
- [ ] Smoke test via AWS CLI passou (4 comandos da seção 4)
- [ ] Variáveis adicionadas ao `apps/api/.env` local

---

## 8. O que eu vou fazer quando você voltar com tudo pronto

Resumo para a próxima sessão:

1. `pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner` em `apps/api`
2. `apps/api/src/infra/storage/` — novo módulo
   - `storage-service.ts` (abstract) — interface `StorageService` com `createUploadUrl(key, contentType, maxBytes)` e `createDownloadUrl(key)`
   - `s3-storage-service.ts` — implementação AWS SDK
3. Atualizar `apps/api/src/infra/env/env.schema.ts` com as 5 vars novas (validação Zod)
4. `apps/api/src/domain/patient/application/use-cases/create-document-upload-url.ts` — use case que valida tipo, gera `fileKey` determinístico, chama `StorageService.createUploadUrl()`
5. `apps/api/src/domain/patient/application/use-cases/create-document.ts` — já existe o fluxo, atualizar para receber `fileKey` e persistir
6. `apps/api/src/domain/patient/application/use-cases/get-document-download-url.ts` — use case que checa ownership ou role admin, gera presigned GET
7. Controllers: `POST /documents/presign-upload`, `POST /documents`, `GET /documents/:id/download-url`
8. `apps/api/src/domain/patient/enterprise/entities/document.ts` — trocar campo `url` por `fileKey` (migração de dados: `url` vira `fileKey` com mesmo valor em dev)
9. Frontend `apps/web/src/pages/documents.tsx` — fluxo de 2 passos: presign → `fetch(uploadUrl, { method: 'PUT', body: file })` → confirm
10. Admin `apps/web/src/pages/admin/user-detail.tsx` — botão "Baixar" chama `GET /documents/:id/download-url` e abre em nova aba
11. Testes: mocks do `StorageService` (implementação fake com maps in-memory); testes unit para os 3 use cases novos; atualização dos testes existentes que assumem campo `url`

Tempo estimado: 2-3 horas de implementação + debug.

---

## Referências úteis

- [Pre-signed URLs (AWS docs)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [CORS configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManagingCorsUsing.html)
- [IAM policy best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [S3 pricing calculator](https://calculator.aws/#/createCalculator/S3) (filtre por `sa-east-1`)
