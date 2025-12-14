# Sesame3 App Setup

## Prerequisites

1. Node.js 18+
2. Supabase project created
3. API keys for AI providers (OpenAI, Anthropic, Groq)

---

## Step 1: Environment Variables

Add these to your `.env` file in the `2_app/` directory:

```env
# =============================================================================
# SUPABASE CONFIGURATION
# =============================================================================
# Get these from: Supabase Dashboard > Settings > API

# Project URL (public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Anon/Public Key (safe to expose in browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Service Role Key (server-side only, keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# =============================================================================
# DATABASE (PRISMA)
# =============================================================================
# Get these from: Supabase Dashboard > Settings > Database > Connection string

# Pooled connection (for queries) - Transaction mode, port 6543
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (for migrations) - Session mode, port 5432
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# =============================================================================
# AI PROVIDERS (add when ready)
# =============================================================================

# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Groq (for fast inference)
GROQ_API_KEY=gsk_...
```

---

## Step 2: Install Dependencies

```bash
cd 2_app
npm install
```

---

## Step 3: Generate Prisma Client

```bash
npm run db:generate
```

---

## Step 4: Push Schema to Database

```bash
npm run db:push
```

This creates all tables in your Supabase database.

---

## Step 5: (Optional) View Database

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555

---

## Step 6: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma client after schema changes |
| `npm run db:push` | Push schema to database (dev) |
| `npm run db:migrate` | Create and run migration (production) |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed database with initial data |

---

## Project Structure

```
2_app/
├── app/                    # Next.js App Router
│   ├── (main)/            # Authenticated routes
│   ├── auth/              # Auth pages
│   ├── login/             # Login page
│   └── onboarding/        # Onboarding flow
├── components/            # React components
├── lib/                   # Utilities
│   ├── db.ts             # Prisma client
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # Helper functions
├── prisma/               # Database
│   └── schema.prisma     # Database schema
└── middleware.ts         # Auth middleware
```

---

## Getting Supabase Connection Strings

1. Go to your Supabase project
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **Connection string**
4. Select **URI** format
5. Copy **Transaction mode** (port 6543) for `DATABASE_URL`
6. Copy **Session mode** (port 5432) for `DIRECT_URL`
7. Replace `[YOUR-PASSWORD]` with your database password
