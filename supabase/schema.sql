create extension if not exists "uuid-ossp";

create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  name text not null,
  company text,
  role text,
  linkedin text,
  telegram text,
  source text,
  niche text,
  birthday timestamptz,
  work_anniversary timestamptz,
  pain_points text[] default '{}',
  last_contact timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contacts_user_id on contacts(user_id);
create index if not exists idx_contacts_name on contacts(name);
create index if not exists idx_contacts_niche on contacts(niche);

alter table contacts enable row level security;

drop policy if exists "contacts_select_policy" on contacts;
drop policy if exists "contacts_insert_policy" on contacts;
drop policy if exists "contacts_update_policy" on contacts;
drop policy if exists "contacts_delete_policy" on contacts;

create policy "contacts_select_policy" on contacts for select using (true);
create policy "contacts_insert_policy" on contacts for insert with check (true);
create policy "contacts_update_policy" on contacts for update using (true);
create policy "contacts_delete_policy" on contacts for delete using (true);

