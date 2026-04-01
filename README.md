# Aajao - Next.js + Supabase

This project has been migrated to Next.js (App Router) and Supabase.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase (`@supabase/supabase-js`)

## Local Setup

1. Install dependencies:

   npm install

2. Create `.env.local` with:

   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

3. Run development server:

   npm run dev

4. Open:

   http://localhost:3000

## Scripts

- `npm run dev` - start Next.js dev server
- `npm run build` - production build
- `npm run start` - run production build
- `npm run lint` - TypeScript type-check

## Behavior Validation

Execution-ready validation assets are available here:

- [Behavior Validation Plan](docs/behavior-validation-plan.md)
- [Behavior Validation Tracker](docs/behavior-validation-tracker.csv)

Run this before major feature additions to validate whether the WhatsApp loop is spreading naturally.
