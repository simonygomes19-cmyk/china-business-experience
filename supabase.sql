-- ============================================================
--  Banco de dados das candidaturas (China Business Experience)
--  Rode este script no Supabase:  painel > SQL Editor > New query > Run
-- ============================================================

create table if not exists public.candidaturas (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  nome            text,
  email           text,
  whatsapp        text,
  empresa         text,
  segmento        text,   -- setor da Fase 1 da Canton Fair (eletrônicos, máquinas, etc.)
  perfil          text,   -- empresário / executivo / pretende empreender
  objetivo        text,   -- negócios / negócios+turismo / turismo
  investimento    text,   -- sim / talvez / não (acima de R$ 50 mil)
  disponibilidade text,   -- sim / preciso confirmar / não (datas)
  observacoes     text
);

-- Caso a tabela já exista (como no seu projeto), garanta as colunas novas:
alter table public.candidaturas add column if not exists segmento text;
alter table public.candidaturas add column if not exists qualificado boolean;

-- Tabela das inscrições (etapa 2: cadastro + pagamento dos perfis qualificados)
create table if not exists public.inscricoes (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  nome            text,
  email           text,
  whatsapp        text,
  empresa         text,
  segmento        text,
  cpf             text,
  rg              text,
  nascimento      text,
  endereco        text,
  cnpj            text,
  forma_pagamento text   -- à vista / 20% + cartão / 20% + boleto
);
alter table public.inscricoes enable row level security;
drop policy if exists "permitir insert anonimo inscricoes" on public.inscricoes;
create policy "permitir insert anonimo inscricoes"
  on public.inscricoes for insert to anon with check (true);

-- Segurança: liga o RLS e permite SOMENTE inserções anônimas (envio do formulário).
-- Ninguém consegue LER os dados pelo site; a leitura é feita no painel do Supabase.
alter table public.candidaturas enable row level security;

drop policy if exists "permitir insert anonimo" on public.candidaturas;
create policy "permitir insert anonimo"
  on public.candidaturas
  for insert
  to anon
  with check (true);
