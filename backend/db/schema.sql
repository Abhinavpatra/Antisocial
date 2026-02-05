-- TimerApp core schema (Supabase Postgres)
-- Apply this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

-- =========
-- users / profiles
-- =========

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references public.users (id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  is_private boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references public.users (id) on delete cascade,
  theme_mode text not null default 'system' check (theme_mode in ('system', 'light', 'dark')),
  palette text not null default 'a' check (palette in ('a', 'b', 'c', 'd')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========
-- usage tracking
-- =========

create table if not exists public.usage_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  app_package text,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_ms bigint,
  created_at timestamptz not null default now()
);

create index if not exists usage_sessions_user_started_idx
  on public.usage_sessions (user_id, started_at desc);

-- =========
-- challenges
-- =========

do $$ begin
  create type public.challenge_status as enum ('draft', 'active', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  creator_user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  description text,
  status public.challenge_status not null default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  coin_reward int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists challenges_creator_idx
  on public.challenges (creator_user_id, created_at desc);

do $$ begin
  create type public.challenge_participant_status as enum ('invited', 'joined', 'forfeited', 'completed');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.challenge_participants (
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  status public.challenge_participant_status not null default 'invited',
  joined_at timestamptz,
  completed_at timestamptz,
  primary key (challenge_id, user_id)
);

-- =========
-- social graph
-- =========

do $$ begin
  create type public.friend_status as enum ('requested', 'accepted', 'blocked');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.friends (
  requester_user_id uuid not null references public.users (id) on delete cascade,
  addressee_user_id uuid not null references public.users (id) on delete cascade,
  status public.friend_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (requester_user_id, addressee_user_id),
  constraint friends_not_self check (requester_user_id <> addressee_user_id)
);

create index if not exists friends_addressee_idx
  on public.friends (addressee_user_id, status, created_at desc);

-- =========
-- gamification: badges + coins
-- =========

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  description text,
  icon text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  user_id uuid not null references public.users (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table if not exists public.coins_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  delta int not null,
  reason text not null,
  ref_type text,
  ref_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists coins_ledger_user_created_idx
  on public.coins_ledger (user_id, created_at desc);

