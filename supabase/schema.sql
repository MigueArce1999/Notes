-- Nöte production schema. Applied to the Supabase project through migrations.
-- All tables are private behind RLS; only the server-side bridge uses service_role.

create table public.customers (
  id uuid primary key,
  payload jsonb not null,
  revision integer not null default 1 check (revision >= 1),
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notes (like public.customers including all);
create table public.orders (like public.customers including all);
create table public.expenses (like public.customers including all);

create index customers_created_at_idx on public.customers(created_at desc);
create index notes_created_at_idx on public.notes(created_at desc);
create index orders_created_at_idx on public.orders(created_at desc);
create index expenses_created_at_idx on public.expenses(created_at desc);

alter table public.customers enable row level security;
alter table public.notes enable row level security;
alter table public.orders enable row level security;
alter table public.expenses enable row level security;

revoke all on public.customers, public.notes, public.orders, public.expenses from anon, authenticated;
grant all on public.customers, public.notes, public.orders, public.expenses to service_role;

-- The deployed migration also contains the restricted RPC functions used by
-- the Edge Function bridge: note_list_all, note_save_admin,
-- note_archive_admin and note_save_profile.
