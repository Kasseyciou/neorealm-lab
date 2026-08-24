create table public.instagram_posts (
  media_id text primary key,
  title text not null default 'NeoRealm LAB Visual' check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 2200),
  alt_text text not null default '' check (char_length(alt_text) <= 240),
  media_type text not null default 'IMAGE' check (media_type in ('IMAGE', 'VIDEO', 'CAROUSEL_ALBUM')),
  cover_path text not null,
  video_path text,
  permalink text not null check (permalink ~ '^https://'),
  carousel jsonb not null default '[]'::jsonb check (jsonb_typeof(carousel) = 'array'),
  posted_at timestamptz,
  visible boolean not null default false,
  display_order integer,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not visible or display_order is not null)
);

create index instagram_posts_display_idx
on public.instagram_posts (visible, display_order, posted_at desc);

create trigger instagram_posts_set_updated_at before update on public.instagram_posts
for each row execute function public.set_updated_at();

alter table public.instagram_posts enable row level security;

create policy "Public can read selected Instagram posts"
on public.instagram_posts for select to anon, authenticated
using (visible = true or public.is_content_manager());

create policy "Content managers can update Instagram posts"
on public.instagram_posts for update to authenticated
using (public.is_content_manager()) with check (public.is_content_manager());

create or replace function public.set_instagram_post_visibility(p_media_id text, p_visible boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_order integer;
begin
  if not public.is_content_manager() then
    raise exception 'Not authorized';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('neorealm-instagram-selection'));

  if p_visible then
    if not exists (
      select 1 from public.instagram_posts where media_id = p_media_id and visible = true
    ) and (select count(*) from public.instagram_posts where visible = true) >= 20 then
      raise exception 'Front-end selection is limited to 20 posts.';
    end if;

    select coalesce(max(display_order), -1) + 1 into next_order
    from public.instagram_posts where visible = true;

    update public.instagram_posts
    set visible = true,
        display_order = coalesce(display_order, next_order)
    where media_id = p_media_id;
  else
    update public.instagram_posts
    set visible = false,
        display_order = null
    where media_id = p_media_id;
  end if;
end;
$$;

revoke all on function public.set_instagram_post_visibility(text, boolean) from public, anon;
grant execute on function public.set_instagram_post_visibility(text, boolean) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'instagram-media',
  'instagram-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can view archived Instagram media"
on storage.objects for select to anon, authenticated
using (bucket_id = 'instagram-media');

grant select on public.instagram_posts to anon;
grant select, update on public.instagram_posts to authenticated;
