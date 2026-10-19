create table if not exists public.historias_medicas (
    id text primary key,
    "updatedAt" timestamptz not null default now(),
    payload jsonb not null default '{}'::jsonb
);

alter table public.historias_medicas
    add column if not exists "updatedAt" timestamptz not null default now();

alter table public.historias_medicas
    add column if not exists payload jsonb not null default '{}'::jsonb;

create unique index if not exists historias_medicas_id_unique
    on public.historias_medicas (id);

alter table public.historias_medicas enable row level security;

revoke all privileges on table public.historias_medicas from anon, public;
grant select, insert, update, delete on table public.historias_medicas to authenticated;

drop policy if exists historias_medicas_authenticated_all on public.historias_medicas;
create policy historias_medicas_authenticated_all
    on public.historias_medicas
    for all
    to authenticated
    using (auth.uid() is not null)
    with check (auth.uid() is not null);
