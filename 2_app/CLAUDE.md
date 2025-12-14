# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sesame3 is a college admissions preparation app targeting high school students. It helps students track their profile (academics, activities, awards), manage school lists, set goals, and get AI-powered advising. The product philosophy is "college prep without the panic."

## Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production (runs prisma generate first)
npm run lint         # Run ESLint

# Database (Prisma + Supabase)
npm run db:push      # Push schema to database (uses .env.local)
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Seed database (tsx prisma/seed.ts)
```

## Tech Stack

- **Framework**: Next.js 16 with App Router, React 19
- **Database**: PostgreSQL via Supabase with Prisma ORM
- **Auth**: Supabase Auth (handles sessions via middleware)
- **Styling**: Tailwind CSS v4
- **Fonts**: Inter, JetBrains Mono, Satoshi

## Architecture

### Route Structure

- `app/(main)/` - Authenticated app routes wrapped in `AppLayout` (sidebar + bottom nav)
  - `/` - Dashboard home
  - `/plan` - Goals and planning
  - `/profile` - Student profile
  - `/schools` - School list management
  - `/discover` - Discovery/exploration
  - `/advisor` - AI advisor chat
- `app/auth/` - Authentication pages
- `app/login/` - Login page
- `app/onboarding/` - New user onboarding flow

### Data Layer

- `lib/db.ts` - Prisma client singleton
- `lib/supabase/` - Supabase client setup
  - `server.ts` - Server-side client (Server Components, API routes)
  - `client.ts` - Browser-side client
  - `middleware.ts` - Session refresh middleware
- `lib/data/types.ts` - Shared TypeScript types for student profile data
- `lib/data/mock/` - Mock data for development

### Auth Flow

Authentication is handled via Next.js middleware (`middleware.ts`):
- Protected routes: `/`, `/plan`, `/profile`, `/schools`, `/discover`, `/advisor`
- Auth routes (`/login`, `/auth`) redirect to home if already authenticated
- Middleware refreshes Supabase sessions on each request

### Database Schema

The Prisma schema (`prisma/schema.prisma`) is organized into 5 layers:

1. **Identity & Auth**: `User` model linked to Supabase Auth
2. **Student Profile**: Core data models (`StudentProfile`, `AboutMe`, `Academics`, `Testing`, `Course`, `Activity`, `Award`, `Program`)
3. **Schools & Planning**: `School` (reference data), `StudentSchool` (user's school list), `Goal`, `Task`
4. **AI & Conversations**: `Conversation`, `Message`, `StudentContext`
5. **Access Control**: `AccessGrant`, `Organization` (for counselors/parents)

### Component Organization

- `components/layout/` - App shell (`AppLayout`, `Sidebar`, `BottomNav`)
- `components/dashboard/` - Dashboard widgets
- `components/chat/` - AI chat components
- `components/plan/` - Goal/planning components
- `components/ui/` - Reusable UI primitives (`Button`, `Card`, `StatusBadge`)

## Environment Variables

Required in `.env` (for Prisma) and `.env.local` (for Next.js):
- `DATABASE_URL` - Supabase pooler connection (port 6543 with `?pgbouncer=true`)
- `DIRECT_URL` - Supabase session mode connection (port 5432, for migrations)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `ANTHROPIC_API_KEY`, `GROQ_API_KEY` - LLM provider keys
