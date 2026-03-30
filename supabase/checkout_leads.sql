create extension if not exists pgcrypto;

create table if not exists public.checkout_leads (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  customer_name text not null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  city text not null,
  postal_code text,
  note text,
  delivery_method text not null,
  shipping_cost integer not null default 0,
  subtotal integer not null,
  total integer not null,
  items_count integer not null default 0,
  payment_method text not null default 'cash_on_delivery',
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists checkout_leads_created_at_idx on public.checkout_leads (created_at desc);
create index if not exists checkout_leads_email_idx on public.checkout_leads (email);

alter table public.checkout_leads enable row level security;

create policy "Allow service role full access on checkout_leads"
on public.checkout_leads
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
