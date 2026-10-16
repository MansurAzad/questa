<div align="center">
database name= questraworld
database password= EHh23793R98OsJ7k

# Questra World

**A modern real-estate investment platform with a public marketing homepage, an investor dashboard, and a full admin console.**

Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

</div>

---

## Overview

Questra World is a single-page application that combines three experiences in one app:

- **Public website** — hero sign-up, project showcases, timeline, media, notice board, investment & ROI calculator, site-visit booking, and legal/security information.
- **Investor dashboard** — personal KPIs, referral network, KYC, deposits & installments, double profit plan, share dividends, notices, and support.
- **Admin console** — investor & KYC management, double profit, shares & dividends, deposits & installments, referrals & network, signup records, notice board, support desk, and a homepage CMS.

App data is persisted client-side (encrypted `localStorage`), and every investor signup is also written to a real **Supabase (Postgres)** database, which the admin console reads back. When Supabase is unreachable the app falls back to the local copy, so it still works offline.

## Features

### Public site
- Hero registration form with inline validation and a conditional investor-portal CTA.
- Interactive project explorer and project timeline.
- Investment & ROI / installment calculator.
- Media gallery and notice board.
- Site-visit booking with full form validation.
- Legal, security, and contact sections.

### Investor dashboard
- Overview with live KPIs and quick actions.
- Own referral & network data (2 generations by default, expandable), including a generation tree.
- KYC submission and status tracking.
- Deposit slips (**USDT / TRC20**, admin-approved) and installment records.
- Double profit plan, share dividends, notices, and support tickets.
- **Full English-only UI** with worldwide (locale-neutral) data; amounts are rendered in **USD (`$`)**.

### Admin console
- Profile-name dropdown menu; card-based, responsive layouts.
- Referral settings with an editable commission matrix (default **10% / 5%**) and recalculation.
- Crypto settings with an admin-controlled wallet address.
- Manual deposit approval flow (creates/updates installment records on approval).
- Notice board, support desk, and dividend management.
- **Signups** — a read-out of the public signup form (user name, full name, phone, email, password, transaction pin, reference username, member ID, date, source), with search, a masked password/PIN reveal toggle, and delete. Records are read from Supabase with a local fallback.
- **Homepage CMS**: manage homepage sections (show/hide, reorder, edit text), a content library (features, testimonials, FAQs) with full CRUD, and site-wide settings (brand, tagline, support contacts, footer & copyright text).

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 19, TypeScript 7 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| QR codes | qrcode.react |
| Database | Supabase (Postgres) via PostgREST + Row Level Security |

## Getting Started

**Prerequisites:** Node.js 18+ (npm included) and a Supabase project.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure Supabase. Copy `.env.example` to `.env` and fill in the two browser-safe values
   (Supabase Dashboard → Project Settings → API):

   ```bash
   VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
   ```

3. Create the `signups` table — open **SQL Editor** in the Supabase dashboard and run
   [`supabase/schema.sql`](supabase/schema.sql) (creates the table, indexes, and RLS policies).

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Vite serves the app on the configured port (default `3000`). Open the printed URL in your browser.

   > If Supabase is not configured or unreachable, signups are still captured locally and appear in
   > Admin → Signups as `LOCAL`; when connected they show as `DATABASE`.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server (`--port=3000 --host`). |
| `npm run build` | Build for production into `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run `tsc --noEmit` type checking. |
| `npm run clean` | Remove `dist/` and generated build artifacts. |

## Demo Access

This is a client-side prototype; use the following demo credentials to explore:

- **Investor:** `user1` / `123456`
- **Admin:** open the navbar profile dropdown and choose **Admin 360° Control** (or sign in as `admin` / `admin123`).

> The admin console is reachable from the profile menu and is not role-gated in this prototype.

## Project Structure

```
src/
├── components/
│   ├── admin/       # Admin console (dashboard, modals, CMS manager)
│   ├── auth/        # Authentication modals
│   ├── common/      # Shared building blocks
│   ├── dashboard/   # Investor dashboard views & navigation
│   ├── layout/      # Navbar, footer, layout shells
│   ├── public/      # Public marketing sections
│   ├── ui/          # Reusable UI primitives (incl. validation UI)
│   └── widget/      # Small self-contained widgets
├── services/        # Storage & data services (localStorage, Supabase client)
├── types/           # Shared TypeScript types (incl. CMS models)
└── utils/           # Helpers (incl. the validation rule engine)

supabase/
└── schema.sql       # `signups` table, indexes, and RLS policies
```

## Database (Supabase)

Investor signups are written to the `public.signups` table over Supabase's PostgREST API
from the browser, and the admin **Signups** tab reads them back.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `bigint` | Identity primary key |
| `username` | `text` | Unique (case-insensitive in app logic) |
| `full_name`, `phone`, `email` | `text` | Signup form values |
| `password`, `transaction_pin` | `text` | Stored as entered (demo); hash these before production |
| `reference_username`, `member_id`, `joined_date` | `text` | Referral + membership metadata |
| `ip`, `user_agent` | `text` | Reserved for server-side enrichment |
| `created_at` | `timestamptz` | Defaults to `now()` |

`schema.sql` enables Row Level Security and grants the publishable/anon role insert + select + delete
so the prototype works without a backend. Before production, move admin reads/deletes behind a
server-side route using the service-role key and restrict the anon role to `insert` only.

## Deployment

The build output in `dist/` is a static site and can be hosted on any static provider (Vercel, Netlify, GitHub Pages, etc.). A `vercel.json` is included for one-step Vercel deploys.

```bash
npm run build
```

Set the same two environment variables in your hosting provider so the production build can reach Supabase:

```bash
VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
```

> Only the publishable (anon) key belongs in the browser bundle — never the `service_role` key.

## License

Part of the Questra World project. All rights reserved.
