-- ============================================================
-- Migration: 0001_initial_schema
-- Description: Core tables for Lean MVP (profiles, ventures, applications)
-- ============================================================

-- ----- Extensions -----
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- ============================================================
-- Enums
-- ============================================================
create type venture_stage as enum (
  'idea',
  'validation',
  'building',
  'launched'
);

create type compensation_mode as enum (
  'equity',
  'cash',
  'hybrid',
  'volunteer'
);

create type venture_status as enum (
  'draft',
  'open',
  'closed',
  'archived'
);

create type application_mode as enum (
  'capacity',
  'outcome'
);

create type application_status as enum (
  'pending',
  'accepted',
  'rejected',
  'withdrawn'
);

-- ============================================================
-- Tables
-- ============================================================

-- ----- profiles -----
-- Mirrors auth.users 1:1, holds public profile info.
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  headline text check (char_length(headline) <= 120),
  bio text check (char_length(bio) <= 1000),
  skills text[] default '{}',
  timezone text,
  weekly_hours_available int check (weekly_hours_available between 0 and 80),
  hourly_value numeric(10, 2) check (hourly_value >= 0),
  links jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public profile data, one row per auth user.';

-- ----- ventures -----
create table public.ventures (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique check (char_length(slug) between 4 and 100),
  founder_id uuid not null references public.profiles(user_id) on delete restrict,
  title text not null check (char_length(title) between 3 and 120),
  thesis text not null check (char_length(thesis) between 20 and 500),
  problem text check (char_length(problem) <= 1500),
  target_outcome text check (char_length(target_outcome) <= 1500),
  stage venture_stage not null default 'idea',
  team_size_target int check (team_size_target between 2 and 20),
  weekly_hours_expected int check (weekly_hours_expected between 1 and 60),
  compensation_mode compensation_mode not null default 'volunteer',
  required_skills text[] default '{}',
  status venture_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.ventures is 'Public ventures (project opportunities) created by founders.';

create index ventures_status_idx on public.ventures(status) where status = 'open';
create index ventures_founder_idx on public.ventures(founder_id);
create index ventures_stage_idx on public.ventures(stage);
create index ventures_created_at_idx on public.ventures(created_at desc);

-- ----- applications -----
create table public.applications (
  id uuid primary key default uuid_generate_v4(),
  venture_id uuid not null references public.ventures(id) on delete cascade,
  applicant_id uuid not null references public.profiles(user_id) on delete cascade,
  mode application_mode not null,

  -- Capacity mode fields
  role text check (char_length(role) <= 100),
  weekly_hours int check (weekly_hours between 1 and 60),
  availability_start date,
  hourly_rate_ref numeric(10, 2) check (hourly_rate_ref >= 0),

  -- Outcome mode fields
  deliverable text check (char_length(deliverable) <= 1500),
  target_date date,
  requested_amount numeric(10, 2) check (requested_amount >= 0),
  acceptance_criteria text check (char_length(acceptance_criteria) <= 1500),

  -- Shared
  what_i_offer text not null check (char_length(what_i_offer) between 20 and 1500),
  links jsonb default '[]',

  status application_status not null default 'pending',
  founder_note text check (char_length(founder_note) <= 1000),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Logical constraints based on mode
  constraint capacity_fields_required check (
    mode <> 'capacity' or (
      role is not null
      and weekly_hours is not null
    )
  ),
  constraint outcome_fields_required check (
    mode <> 'outcome' or (
      deliverable is not null
      and target_date is not null
      and acceptance_criteria is not null
    )
  ),
  -- Applicant cannot be the founder; enforced at app level too
  constraint applicant_not_founder check (true)
);

comment on table public.applications is 'Join requests submitted by users to ventures.';

-- Only one PENDING application per (venture, applicant)
create unique index applications_unique_pending
  on public.applications(venture_id, applicant_id)
  where status = 'pending';

create index applications_venture_idx on public.applications(venture_id);
create index applications_applicant_idx on public.applications(applicant_id);
create index applications_status_idx on public.applications(status);

-- ============================================================
-- Triggers
-- ============================================================

-- Auto-create profile when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at on row changes
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger ventures_set_updated_at
  before update on public.ventures
  for each row execute function public.set_updated_at();

create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- Prevent founder from applying to their own venture (DB-level guard)
create or replace function public.prevent_self_application()
returns trigger
language plpgsql
as $$
declare
  v_founder uuid;
begin
  select founder_id into v_founder from public.ventures where id = new.venture_id;
  if v_founder = new.applicant_id then
    raise exception 'لا يمكنك التقديم على Venture خاصتك' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger applications_prevent_self
  before insert on public.applications
  for each row execute function public.prevent_self_application();
