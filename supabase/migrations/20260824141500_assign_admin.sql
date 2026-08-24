insert into public.profiles (id, display_name, role)
select id, 'NeoRealm LAB', 'admin'::public.app_role
from auth.users
where lower(email) = 'kasseyworks@gmail.com'
on conflict (id) do update
set display_name = excluded.display_name,
    role = excluded.role,
    updated_at = now();
