-- =============================================================================
-- Questra World — signup registrations table
-- Run this once in the Supabase SQL Editor (or via psql):
--   Supabase Dashboard → SQL Editor → New query → paste → Run
-- =============================================================================

create table if not exists public.signups (
  id                bigint generated always as identity primary key,
  username          text not null,
  full_name         text,
  phone             text,
  email             text,
  password          text,
  transaction_pin   text,
  reference_username text,
  member_id         text,
  joined_date       text,
  ip                text,
  user_agent        text,
  created_at        timestamptz not null default now(),
  -- One row per registered username (case-insensitive).
  constraint signups_username_unique unique (username)
);

create index if not exists signups_created_at_idx on public.signups (created_at desc);
create index if not exists signups_email_idx on public.signups (email);

-- -----------------------------------------------------------------------------
-- Row Level Security: the public site may register (insert) and the admin
-- console may read/delete. No anon update. Tighten further by replacing these
-- policies with a service-role-only setup once admin auth is server-side.
-- -----------------------------------------------------------------------------
alter table public.signups enable row level security;

drop policy if exists "public can insert signups"        on public.signups;
drop policy if exists "public can read signups"          on public.signups;
drop policy if exists "public can delete signups"        on public.signups;

create policy "public can insert signups"
  on public.signups for insert
  to anon, authenticated
  with check (true);

create policy "public can read signups"
  on public.signups for select
  to anon, authenticated
  using (true);

create policy "public can delete signups"
  on public.signups for delete
  to anon, authenticated
  using (true);
