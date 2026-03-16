# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 work checkout tracking application that sends LINE notifications when users check out from work. The app integrates with NextAuth for authentication, LINE Messaging API for notifications, and Vercel AI SDK for generating personalized checkout messages.

## Development Commands

### Running the application
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build production bundle
npm start            # Run production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test:e2e              # Run all Playwright E2E tests
npm run test:e2e:smoke        # Run smoke tests (login spec only, used in pre-push hook)
npm run test:e2e:ui           # Run tests with Playwright UI
npm run test:e2e:debug        # Run tests in debug mode
npm run test:e2e:headed       # Run tests in headed mode
npm run test:e2e:report       # Show test report
```

### Pre-push Hook
A pre-push git hook (`.githooks/pre-push`) automatically runs smoke E2E tests before pushing. Skip with:
```bash
SKIP_E2E=1 git push
```

## Architecture

### Hybrid Routing
This project uses **both** App Router and Pages Router:
- **App Router** (`src/app/`): Main UI pages, new API routes (`/api/work_records`)
- **Pages Router** (`src/pages/`): Legacy API routes and authentication handlers

### Key Components

**Authentication:**
- Uses NextAuth.js with JWT strategy
- Simple password-based authentication (no database)
- Auth configuration: `src/pages/api/[...nextauth].ts` (Pages Router)
- App Router handler: `src/app/api/auth/[...nextauth]/route.ts` (delegates to Pages Router config)

**API Routes:**
- `src/pages/api/checkout.ts` - Sends LINE push notifications for checkout
- `src/pages/api/vercelAI.ts` - Generates AI-powered checkout messages using Vercel AI SDK
- `src/app/api/work_records/route.ts` - New App Router API with Zod validation

**Environment-Aware:**
- Uses `isDev()`, `isStg()` from `src/app/utility/checkEnvironment.ts`
- Different LINE tokens/targets for dev/stg/prod environments

**Presentation Layer:**
- UI components in `src/app/presentation/components/`
- Client-side components use `"use client"` directive
- Main page: `src/app/page.tsx`

### E2E Testing

Tests are organized under `e2e/`:
- `e2e/tests/` - Test specs organized by feature (auth, checkout, api)
- `e2e/pages/` - Page Object Model implementations
- `e2e/global-setup.ts` - Authenticates and saves session state
- `e2e/.auth/user.json` - Persisted auth state (gitignored)

**Test Environment:**
- Uses `.env.test` for test credentials
- `E2E_FAKE_LLM=1` flag disables real AI calls during tests (returns mock messages)
- Authentication persisted via `storageState` to avoid repeated logins

### Validation

Uses Zod for schema validation:
- Example: `src/app/api/work_records/validator.ts` defines work record schema
- Use `safeParse()` for validation with error handling

## Important Patterns

**AI Message Generation:**
- Vercel AI SDK replaces legacy Gemini integration (see commit history)
- Falls back to static messages if AI generation fails or times out
- Test mode returns fixed dummy messages

**LINE Integration:**
- Environment-aware token/target selection
- Formats checkout messages with timestamp and optional user text
- Uses axios for LINE Messaging API calls

**Path Aliases:**
- `@/*` maps to `src/*` (configured in tsconfig.json)

## Style Guide

From `.gemini/styleguide.md`:
- 日本語で返答してください (Respond in Japanese)

## Git Workflow

- Main branch: `main`
- PR workflow enabled with pr-agent (`.github/workflows/pr-agent.yml`)
- Pre-push hook runs smoke E2E tests automatically
