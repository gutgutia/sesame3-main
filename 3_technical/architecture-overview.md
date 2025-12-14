# Sesame3 Technical Architecture — Overview

## Summary

Sesame3 is a conversation-first college counseling platform. This document captures the high-level technical decisions for the MVP and future scaling.

---

## Core Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 15+ (App Router) | Already in use, great for streaming, SSR/SSG |
| **Styling** | TailwindCSS 4 | Already in use, rapid development |
| **Language** | TypeScript | Type safety, better DX |
| **Database** | PostgreSQL (Supabase) | Relational data, JSONB flexibility, strong tooling |
| **ORM** | Prisma | Type-safe queries, migrations |
| **Auth** | Supabase Auth | OAuth + email, session management |
| **AI - Fast** | Groq (Llama 3.1 70B) | Ultra-fast parsing, ~50ms first token |
| **AI - Intelligent** | Claude Opus 4.5 | Deep reasoning, empathetic responses, tool calling |
| **Hosting** | Vercel | Seamless Next.js deployment, edge functions |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Next.js Application                       │    │
│  │   • React UI (Chat, Dashboard, Profile, Schools, Plan)      │    │
│  │   • PWA-enabled for mobile                                   │    │
│  │   • Capacitor wrapper for App Store (future)                │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API LAYER                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │               Next.js API Routes / Server Actions            │    │
│  │   • Profile CRUD                                             │    │
│  │   • School list management                                   │    │
│  │   • Goals and tasks                                          │    │
│  │   • AI chat orchestration (streaming)                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
┌───────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    PostgreSQL     │ │   AI Models     │ │  File Storage   │
│    (Supabase)     │ │                 │ │  (Future)       │
│                   │ │ • Groq (fast)   │ │                 │
│ • User data       │ │ • Claude (deep) │ │ • Transcripts   │
│ • Profiles        │ │                 │ │ • Documents     │
│ • Conversations   │ │                 │ │                 │
│ • Schools         │ │                 │ │                 │
└───────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## Key Architectural Decisions

### 1. Multi-Model AI Architecture

Use different models for different purposes to optimize for both speed and quality:

```
User Message
     │
     ▼
┌────────────────────────────────────────────────────────────────────┐
│ GROQ (Llama 3.1 70B) — FAST                                        │
│                                                                     │
│ 1. Parse message (entities, intents, emotion)                      │
│ 2. Generate quick acknowledgment (streaming starts immediately)    │
│    "Great, let me think about your Stanford question..."           │
│                                                                     │
│ Time to first token: ~50ms                                          │
└────────────────────────────────────────────────────────────────────┘
     │
     │ Passes parsed context to Claude
     ▼
┌────────────────────────────────────────────────────────────────────┐
│ CLAUDE OPUS 4.5 — INTELLIGENT CORE                                 │
│                                                                     │
│ • Deep reasoning about profile, schools, strategy                  │
│ • Empathetic, nuanced responses                                    │
│ • Tool calls for all data points                                   │
│ • Complex advice (early decision, course selection, etc.)          │
│                                                                     │
│ Streaming continues from Groq's acknowledgment                      │
└────────────────────────────────────────────────────────────────────┘
     │
     ▼
Response + Tool Calls → Widgets
```

**Result**: Ultra-fast first token (~50ms) + high-quality advisory (Claude).

| Model | Role | Latency | Cost |
|-------|------|---------|------|
| **Groq (Llama 3.1 70B)** | Parsing, quick ack | ~50ms first token | Very low |
| **Claude Opus 4.5** | Deep reasoning, tool calls | ~1-2s | Higher |

### 2. Conversation Latency Strategy

Most user inputs don't need full LLM processing. Use a tiered approach:

| Tier | Latency | Use Case |
|------|---------|----------|
| **Tier 1: Regex** | <20ms | Simple patterns ("GPA 3.9", "SAT 1520") |
| **Tier 2: Groq** | ~50ms | Parse intents, quick acknowledgment |
| **Tier 3: Claude** | 1-2s | Complex reasoning, advice, tool calls |

**Result**: User always sees immediate response.

### 3. Streaming Responses

When LLM is needed, stream the response:
- Groq generates acknowledgment immediately ("Let me think about your MIT question...")
- Claude streams the detailed response
- Widget appears at the end after tool call confirmation

**Technology**: Vercel AI SDK with Server-Sent Events (SSE)

### 4. AI Memory Architecture

```
Sent to LLM each call (~1,700 tokens):
├── System prompt (~300 tokens)
├── Profile facts (~200 tokens)
├── Rolling summary (~400 tokens)
└── Recent 5-10 messages (~800 tokens)

NOT sent (stored for reference):
└── Full conversation history (all messages ever)
```

**Summarization**: Run periodically with Groq or a cheap model.

### 5. Mobile Strategy

| Phase | Approach |
|-------|----------|
| **Phase 1** | PWA (Next.js, works on all devices) |
| **Phase 2** | Capacitor wrapper → App Store presence |
| **Phase 3** | Native features via Capacitor plugins |

No React Native needed. Same codebase for web and mobile.

### 6. Access Control Model

```
StudentProfile (owned by User)
        │
        ▼
AccessGrant (explicit permissions)
        │
        └── "User X can access Profile Y with permission Z"
```

Simple, auditable, revocable. Organizations layer on top for counselors.

---

## Data Flow: Chat Message

```
User types message
        │
        ▼
┌───────────────────────────────────┐
│ 1. API: Load context              │
│    • Profile facts                │
│    • Rolling summary              │
│    • Recent messages              │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ 2. GROQ: Fast parse + acknowledge │  ──▶ Streaming starts immediately
│    • Parse entities/intents       │      "Let me think about MIT..."
│    • Generate quick ack           │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ 3. CLAUDE: Deep reasoning         │  ──▶ Continues streaming
│    • Full context + parsed info   │
│    • Tool calls for data capture  │
│    • Nuanced advice               │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ 4. Store: Save message            │
│    • Execute tool calls           │
│    • Update profile               │
│    • Check if summarization due   │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ 5. Client: Render response        │
│    • Text streamed in real-time   │
│    • Widget appears after confirm │
└───────────────────────────────────┘
```

---

## Hosting & Infrastructure

### MVP

| Service | Provider | Notes |
|---------|----------|-------|
| **App Hosting** | Vercel | Free tier to start |
| **Database** | Supabase PostgreSQL | Free tier: 500MB |
| **Auth** | Supabase Auth | Included with Supabase |
| **AI - Fast** | Groq | Very cheap, fast |
| **AI - Deep** | Anthropic (Claude) | Pay-per-use |
| **Domain** | Cloudflare | DNS + CDN |

**Estimated cost**: ~$0-50/month for early users

### Scaling

| Service | Provider |
|---------|----------|
| **App Hosting** | Vercel Pro |
| **Database** | Supabase Pro |
| **File Storage** | Cloudflare R2 or S3 |
| **Background Jobs** | Inngest or Trigger.dev |
| **Monitoring** | Vercel Analytics + Sentry |

---

## Security Considerations

| Concern | Approach |
|---------|----------|
| **Auth** | OAuth (Google/Apple) + email/password via Supabase Auth |
| **Data at rest** | PostgreSQL encryption (Supabase default) |
| **Data in transit** | HTTPS everywhere (Vercel default) |
| **API keys** | Environment variables, never client-side |
| **Row-level security** | Supabase RLS policies for data access |
| **FERPA compliance** | Student data is protected; ensure proper consent flows |

---

## Implementation Phases

### Week 1: Foundation + AI Validation (Parallel)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PARALLEL WORKSTREAMS                          │
├─────────────────────────────────────────────────────────────────────┤
│  TRACK 1: Foundation                 TRACK 2: AI Validation         │
│  ─────────────────────               ──────────────────────         │
│                                                                      │
│  Day 1-2:                            Day 1-2:                        │
│  ✅ Supabase project created         • Test prompts in Claude        │
│  ✅ Prisma schema defined            • Test Groq for parsing         │
│  • Basic auth setup                  • Validate tool calling         │
│  • Seed school data (top 50)                                         │
│                                                                      │
│  Day 3-4:                            Day 3-4:                        │
│  • Profile CRUD APIs                 • Build chat API route          │
│  • Connect existing UI               • Test streaming                │
│  • Basic data flowing                • Test multi-intent parsing     │
│                                                                      │
│  Day 5:                                                              │
│  • MERGE: AI uses real database                                      │
│  • Full loop: Chat → Parse → Tools → Save → Widgets                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Week 2: Core AI Loop
- [ ] Connect Groq for fast parsing
- [ ] Connect Claude for deep reasoning
- [ ] Implement tool calling for profile updates
- [ ] Build confirmation widgets (GPA, SAT, Activity, Award)
- [ ] Streaming responses end-to-end

### Weeks 3-4: Polish
- [ ] Onboarding flow (database-backed)
- [ ] Full profile pages (all pillars)
- [ ] Schools page with real data
- [ ] Plan page with goals/tasks
- [ ] Deploy to Vercel

### Weeks 5-6: AI Enhancement
- [ ] Conversation summarization
- [ ] Cross-conversation context
- [ ] Function calling for all widget types
- [ ] Course planning advice

### Weeks 7-8: Mobile & Sharing
- [ ] PWA optimization
- [ ] Capacitor wrapper (if app store needed)
- [ ] Parent sharing (AccessGrant)

---

## Decisions Made

| Question | Decision |
|----------|----------|
| **Auth provider** | Supabase Auth (included with database) |
| **Database** | Supabase PostgreSQL (batteries-included) |
| **ORM** | Prisma (type-safe, great migrations) |
| **AI - Fast parsing** | Groq (Llama 3.1 70B) |
| **AI - Deep reasoning** | Claude Opus 4.5 (Anthropic) |

## Open Questions

1. **Analytics**: Vercel Analytics, PostHog, or Mixpanel?
2. **Background jobs**: Inngest vs Trigger.dev for summarization?
3. **File storage**: Cloudflare R2 vs S3 for transcripts?

---

## References

- [Data Model](./data-model.md) — Detailed entity descriptions
- [Prisma Schema](../2_app/prisma/schema.prisma) — Complete database schema
- [Information Architecture](../2_app/docs/information-architecture.md) — Product structure
- [Design System](../2_app/docs/product-design-system.md) — UI/UX guidelines
- [Setup Guide](../2_app/SETUP.md) — Local development setup

