create table if not exists public.rural_leads (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 name text not null,
 phone text not null,
 city text not null,
 state text not null,
 answers jsonb not null,
 score integer not null check (score between 0 and 100),
 classification text not null check (classification in ('Organizada','Atenção','Risco')),
 utms jsonb not null default '{}'::jsonb,
 privacy_version text not null
);
alter table public.rural_leads enable row level security;
revoke all on public.rural_leads from anon, authenticated;
-- No public policies. Only the server-side service role may insert/read.
