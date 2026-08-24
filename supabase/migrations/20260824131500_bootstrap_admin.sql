create or replace function public.claim_first_admin()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
  caller_email text := lower(coalesce((select auth.jwt() ->> 'email'), ''));
begin
  if caller_id is null or caller_email <> 'kasseyworks@gmail.com' then
    raise exception 'This account is not allowed to administer NeoRealm LAB.';
  end if;

  perform pg_advisory_xact_lock(82146319);
  if exists (select 1 from public.profiles where role = 'admin') then
    return exists (select 1 from public.profiles where id = caller_id and role = 'admin');
  end if;

  insert into public.profiles (id, display_name, role)
  values (caller_id, 'NeoRealm LAB', 'admin')
  on conflict (id) do update set role = 'admin', display_name = excluded.display_name;
  return true;
end;
$$;

revoke all on function public.claim_first_admin() from public, anon;
grant execute on function public.claim_first_admin() to authenticated;
