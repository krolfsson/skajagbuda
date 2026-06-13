# Ska jag buda?

AI-baserad budgivningscoach för bostadsköp i Sverige. Mata in fakta om en bostad och få ett nyktert scorecard innan du går vidare i budgivningen.

## Tech stack

- **Next.js 15** med App Router
- **TypeScript**
- **Tailwind CSS**
- **Prisma** med PostgreSQL
- **OpenAI-kompatibelt API** (konfigurerbart via env-variabler)
- **Zod** för validering

## Kom igång

### 1. Klona och installera

```bash
git clone <repo>
cd bidder
npm install
```

### 2. Miljövariabler

Kopiera `.env.example` till `.env` och fyll i värdena:

```bash
cp .env.example .env
```

| Variabel       | Beskrivning                                             |
|----------------|---------------------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string                            |
| `AI_API_KEY`   | API-nyckel till din AI-provider                         |
| `AI_BASE_URL`  | Base URL (default: `https://api.openai.com/v1`)         |
| `AI_MODEL`     | Modell att använda (default: `gpt-4o`)                  |

#### Byta AI-provider

`AI_BASE_URL` och `AI_MODEL` gör det enkelt att byta:

- **OpenAI**: `AI_BASE_URL=https://api.openai.com/v1`, `AI_MODEL=gpt-4o`
- **OpenRouter**: `AI_BASE_URL=https://openrouter.ai/api/v1`, `AI_MODEL=anthropic/claude-3.5-sonnet`
- **Anthropic via proxy**: Konfigurera en proxy som exponerar OpenAI-kompatibelt API
- **Lokal modell (Ollama)**: `AI_BASE_URL=http://localhost:11434/v1`, `AI_MODEL=llama3.1`

### 3. Databas

Starta PostgreSQL lokalt (t.ex. via Docker):

```bash
docker run -d \
  --name bidder-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bidder \
  -p 5432:5432 \
  postgres:16
```

Kör Prisma-migrationer:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Starta dev-servern

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000)

## Projektstruktur

```
app/
  api/
    analyses/
      route.ts              # POST /api/analyses
      [id]/
        route.ts            # GET /api/analyses/:id
        run/
          route.ts          # POST /api/analyses/:id/run
  new/
    page.tsx                # Formulär för ny analys
  result/
    [id]/
      page.tsx              # Scorecard-visning
  layout.tsx
  page.tsx                  # Landing page

lib/
  ai.ts                     # AI-wrapper (byt provider här)
  prisma.ts                 # Prisma-klient singleton
  prompt.ts                 # Systemprompt + prompt-builder
  rateLimit.ts              # Enkel in-memory rate limiter
  schemas.ts                # Zod-scheman

prisma/
  schema.prisma             # Datamodell
```

## API

### `POST /api/analyses`

Skapar en ny analys. Body: se `CreateAnalysisSchema` i `lib/schemas.ts`.

Returnerar `{ id: string }`.

### `GET /api/analyses/:id`

Hämtar en analys med alla fält inklusive AI-resultat.

### `POST /api/analyses/:id/run`

Kör AI-analysen för en sparad analys. Returnerar `{ analysis, scorecard }`.

## Vidareutveckling

- **Auth**: Datamodellen är förberedd med `userId`-kommentarer i schemat
- **Rate limiting**: Byt ut `lib/rateLimit.ts` mot Redis/Upstash i produktion
- **AI-provider**: Byt `AI_BASE_URL` + `AI_MODEL` i `.env`, ingen kodändring krävs
- **Fler analysfält**: Utöka `PropertyAnalysis` i `prisma/schema.prisma` + `CreateAnalysisSchema`
