<div align="center">

# Questa World

**A modern real-estate investment platform with a public marketing homepage, an investor dashboard, and a full admin console.**

Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

</div>

---

## Overview

Questa World is a single-page application that combines three experiences in one app:

- **Public website** — hero sign-up, project showcases, timeline, media, notice board, investment & ROI calculator, site-visit booking, and legal/security information.
- **Investor dashboard** — personal KPIs, referral network, KYC, deposits & installments, double profit plan, share dividends, notices, and support.
- **Admin console** — investor & KYC management, double profit, shares & dividends, deposits & installments, referrals & network, notice board, support desk, and a homepage CMS.

All data is persisted client-side (encrypted `localStorage`), so the app runs with **no backend required** — ideal for demos and prototypes.

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
- **Full English-only UI** (currency rendered as `৳`).

### Admin console
- Profile-name dropdown menu; card-based, responsive layouts.
- Referral settings with an editable commission matrix (default **10% / 5%**) and recalculation.
- Crypto settings with an admin-controlled wallet address.
- Manual deposit approval flow (creates/updates installment records on approval).
- Notice board, support desk, and dividend management.
- **Homepage CMS**: manage homepage sections (show/hide, reorder, edit text), a content library (features, testimonials, FAQs) with full CRUD, and site-wide settings (brand, tagline, support contacts, footer & copyright text).

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 19, TypeScript 7 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Animation | motion |
| QR codes | qrcode.react |
| AI (optional) | @google/genai |

## Getting Started

**Prerequisites:** Node.js 18+ (npm included).

1. Install dependencies:

   ```bash
   npm install
   ```

2. (Optional) Configure environment variables — copy `.env.example` to `.env.local` and fill in the values you need:

   ```bash
   cp .env.example .env.local
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Vite serves the app on the configured port (default `3000`). Open the printed URL in your browser.

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

- **Investor:** `Ziabulctg1` / `123456`
- **Admin:** open the navbar profile dropdown and choose **Admin 360° Control**.

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
├── services/        # Storage & data services (localStorage, encryption)
├── types/           # Shared TypeScript types (incl. CMS models)
└── utils/           # Helpers (incl. the validation rule engine)
```

## Deployment

The build output in `dist/` is a static site and can be hosted on any static provider (Vercel, Netlify, GitHub Pages, etc.). A `vercel.json` is included for one-step Vercel deploys.

```bash
npm run build
```

## License

Part of the Questa World project. All rights reserved.
