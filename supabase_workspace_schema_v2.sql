-- =============================================
-- Workspace Schema v2 — run in Supabase SQL Editor
-- =============================================

-- 1. Profiles table (public user info)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  display_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles visible to authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Project members table
create table if not exists public.project_members (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'member' check (role in ('owner', 'member')),
  invited_by uuid references auth.users(id),
  joined_at timestamptz default now(),
  unique(project_id, user_id)
);

alter table public.project_members enable row level security;

-- Helper function to check membership (avoids RLS recursion)
create or replace function public.is_project_member(p_project_id uuid, p_user_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.project_members
    where project_id = p_project_id and user_id = p_user_id
  );
$$ language sql security definer stable;

-- Members policies
create policy "view members of own projects" on public.project_members
  for select using (public.is_project_member(project_id, auth.uid()));

create policy "owners can add members" on public.project_members
  for insert with check (
    auth.uid() = user_id -- owner adding themselves on project create
    or exists (
      select 1 from public.project_members
      where project_id = project_members.project_id
      and user_id = auth.uid() and role = 'owner'
    )
  );

create policy "owners can remove members" on public.project_members
  for delete using (
    exists (
      select 1 from public.project_members pm
      where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid() and pm.role = 'owner'
    )
  );

-- 3. Auto-add creator as owner when project is created
create or replace function public.add_project_owner()
returns trigger as $$
begin
  insert into public.project_members (project_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (project_id, user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_project_created on public.projects;
create trigger on_project_created
  after insert on public.projects
  for each row execute function public.add_project_owner();

-- 4. Update Projects RLS (drop old, add membership-based)
drop policy if exists "view own projects" on public.projects;
drop policy if exists "create projects" on public.projects;
drop policy if exists "update own projects" on public.projects;
drop policy if exists "delete own projects" on public.projects;

create policy "view member projects" on public.projects
  for select using (public.is_project_member(id, auth.uid()));

create policy "create projects" on public.projects
  for insert with check (auth.uid() = owner_id);

create policy "owners can update projects" on public.projects
  for update using (
    exists (select 1 from public.project_members where project_id = id and user_id = auth.uid() and role = 'owner')
  );

create policy "owners can delete projects" on public.projects
  for delete using (
    exists (select 1 from public.project_members where project_id = id and user_id = auth.uid() and role = 'owner')
  );

-- 5. Update Notes RLS
drop policy if exists "view notes in own projects" on public.notes;
drop policy if exists "create notes in own projects" on public.notes;
drop policy if exists "update own notes" on public.notes;
drop policy if exists "delete own notes" on public.notes;

create policy "view notes in member projects" on public.notes
  for select using (public.is_project_member(project_id, auth.uid()));

create policy "create notes in member projects" on public.notes
  for insert with check (
    auth.uid() = author_id and public.is_project_member(project_id, auth.uid())
  );

create policy "update notes in member projects" on public.notes
  for update using (public.is_project_member(project_id, auth.uid()));

create policy "delete notes in member projects" on public.notes
  for delete using (
    auth.uid() = author_id or
    exists (select 1 from public.project_members where project_id = notes.project_id and user_id = auth.uid() and role = 'owner')
  );

-- 6. Update Files RLS
drop policy if exists "view files in own projects" on public.files;
drop policy if exists "upload files to own projects" on public.files;
drop policy if exists "delete own files" on public.files;

create policy "view files in member projects" on public.files
  for select using (public.is_project_member(project_id, auth.uid()));

create policy "upload files to member projects" on public.files
  for insert with check (
    auth.uid() = uploader_id and public.is_project_member(project_id, auth.uid())
  );

create policy "delete files in member projects" on public.files
  for delete using (
    auth.uid() = uploader_id or
    exists (select 1 from public.project_members where project_id = files.project_id and user_id = auth.uid() and role = 'owner')
  );
