-- ============================================================
-- Migration: 0002_rls_policies
-- Description: Row-Level Security policies. Default DENY everything,
--              then grant minimal access via policies.
-- ============================================================

-- Enable RLS on all public tables
alter table public.profiles enable row level security;
alter table public.ventures enable row level security;
alter table public.applications enable row level security;

-- Force RLS even for table owners (extra safety)
alter table public.profiles force row level security;
alter table public.ventures force row level security;
alter table public.applications force row level security;

-- ============================================================
-- profiles policies
-- ============================================================

-- Anyone authenticated can read any profile (it's public info)
create policy "profiles_select_authenticated"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Users can insert their own profile (used only as fallback; trigger handles normal case)
create policy "profiles_insert_self"
  on public.profiles
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- Users can update only their own profile
create policy "profiles_update_self"
  on public.profiles
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- No DELETE policy → no one can delete profiles directly (cascade from auth.users)

-- ============================================================
-- ventures policies
-- ============================================================

-- Anyone (even anonymous) can see ventures that are open/closed/archived
-- Founders can see their own drafts
create policy "ventures_select_public"
  on public.ventures
  for select
  to anon, authenticated
  using (
    status in ('open', 'closed', 'archived')
    or founder_id = (select auth.uid())
  );

-- Only authenticated users can create ventures, and only as themselves
create policy "ventures_insert_self"
  on public.ventures
  for insert
  to authenticated
  with check (founder_id = (select auth.uid()));

-- Only the founder can update their venture
create policy "ventures_update_founder"
  on public.ventures
  for update
  to authenticated
  using (founder_id = (select auth.uid()))
  with check (founder_id = (select auth.uid()));

-- Only the founder can delete their venture
-- (in practice we archive, but the policy exists for cleanups)
create policy "ventures_delete_founder"
  on public.ventures
  for delete
  to authenticated
  using (founder_id = (select auth.uid()));

-- ============================================================
-- applications policies
-- ============================================================

-- An application is visible to:
--   - the applicant themselves
--   - the founder of the related venture
create policy "applications_select_related"
  on public.applications
  for select
  to authenticated
  using (
    applicant_id = (select auth.uid())
    or exists (
      select 1 from public.ventures v
      where v.id = applications.venture_id
        and v.founder_id = (select auth.uid())
    )
  );

-- Any authenticated user (other than the founder) can submit an application
-- to an OPEN venture. Trigger prevents self-applications as well.
create policy "applications_insert_applicant"
  on public.applications
  for insert
  to authenticated
  with check (
    applicant_id = (select auth.uid())
    and exists (
      select 1 from public.ventures v
      where v.id = venture_id
        and v.status = 'open'
        and v.founder_id <> (select auth.uid())
    )
  );

-- Applicants can withdraw their own pending applications.
-- Founders can change status (accept/reject) and write founder_note.
create policy "applications_update_applicant_withdraw"
  on public.applications
  for update
  to authenticated
  using (
    applicant_id = (select auth.uid())
    and status = 'pending'
  )
  with check (
    applicant_id = (select auth.uid())
    and status in ('pending', 'withdrawn')
  );

create policy "applications_update_founder_decide"
  on public.applications
  for update
  to authenticated
  using (
    exists (
      select 1 from public.ventures v
      where v.id = applications.venture_id
        and v.founder_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.ventures v
      where v.id = applications.venture_id
        and v.founder_id = (select auth.uid())
    )
  );

-- No DELETE policy → applications are immutable history; status changes are how we "remove" them

-- ============================================================
-- Helpful SECURITY DEFINER functions (optional, can be used in RPC)
-- ============================================================

-- Count of open applications a user already has on a venture
create or replace function public.has_pending_application(p_venture_id uuid)
returns boolean
language sql
security invoker
stable
as $$
  select exists (
    select 1 from public.applications
    where venture_id = p_venture_id
      and applicant_id = (select auth.uid())
      and status = 'pending'
  );
$$;
