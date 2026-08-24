create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'editor');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.app_role,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.web_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 80),
  description text not null default '' check (char_length(description) <= 180),
  category text not null check (category in ('brand', 'campaign')),
  alt_text text not null default '' check (char_length(alt_text) <= 140),
  cover_path text not null,
  lightbox_path text not null,
  project_url text check (project_url is null or project_url ~ '^https://'),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.instagram_title_overrides (
  media_id text primary key,
  title text not null check (char_length(title) between 1 and 72),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger web_projects_set_updated_at before update on public.web_projects
for each row execute function public.set_updated_at();

create or replace function public.is_content_manager()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('admin', 'editor')
  );
$$;

revoke all on function public.is_content_manager() from public;
grant execute on function public.is_content_manager() to authenticated;

alter table public.profiles enable row level security;
alter table public.web_projects enable row level security;
alter table public.instagram_title_overrides enable row level security;

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy "Admins can manage profiles"
on public.profiles for all to authenticated
using (public.is_content_manager())
with check (public.is_content_manager());

create policy "Public can read published web projects"
on public.web_projects for select to anon, authenticated
using (published = true or public.is_content_manager());

create policy "Content managers can create web projects"
on public.web_projects for insert to authenticated
with check (public.is_content_manager());
create policy "Content managers can update web projects"
on public.web_projects for update to authenticated
using (public.is_content_manager()) with check (public.is_content_manager());
create policy "Content managers can delete web projects"
on public.web_projects for delete to authenticated
using (public.is_content_manager());

create policy "Public can read Instagram title overrides"
on public.instagram_title_overrides for select to anon, authenticated
using (true);
create policy "Content managers can manage Instagram titles"
on public.instagram_title_overrides for all to authenticated
using (public.is_content_manager()) with check (public.is_content_manager());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('web-project-covers', 'web-project-covers', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('web-project-pages', 'web-project-pages', true, 20971520, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can view project images"
on storage.objects for select to anon, authenticated
using (bucket_id in ('web-project-covers', 'web-project-pages'));

create policy "Content managers can upload project images"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('web-project-covers', 'web-project-pages')
  and public.is_content_manager()
);
create policy "Content managers can update project images"
on storage.objects for update to authenticated
using (
  bucket_id in ('web-project-covers', 'web-project-pages')
  and public.is_content_manager()
) with check (
  bucket_id in ('web-project-covers', 'web-project-pages')
  and public.is_content_manager()
);
create policy "Content managers can delete project images"
on storage.objects for delete to authenticated
using (
  bucket_id in ('web-project-covers', 'web-project-pages')
  and public.is_content_manager()
);

grant select on public.web_projects, public.instagram_title_overrides to anon;
grant select on public.profiles, public.web_projects, public.instagram_title_overrides to authenticated;
grant insert, update, delete on public.profiles, public.web_projects, public.instagram_title_overrides to authenticated;
