-- Conecta ADM Patos — schema do Supabase
-- Rode este script inteiro em: Supabase > SQL Editor > New query > Run

-- 1) Tabela de inscrições -----------------------------------------------
create table if not exists registrations (
  email text primary key,
  name text not null,
  institution text,
  code text not null,
  created_at timestamptz not null default now()
);

alter table registrations enable row level security;

-- Ninguém (nem o público, nem o admin) lê ou escreve direto na tabela.
-- Toda a leitura pública passa pela função get_registration() abaixo,
-- que devolve só o necessário para emitir 1 certificado por vez — assim
-- visitantes não conseguem baixar a lista inteira de e-mails.
-- O admin autenticado é a única exceção, para a tela de inscrições.
create policy "admin pode ler inscricoes"
  on registrations for select
  to authenticated
  using (true);

-- 2) Tabela de configuração do evento (uma linha só, id fixo = 1) -------
create table if not exists event_config (
  id int primary key default 1,
  event_name text not null,
  date_label text not null,
  time_label text not null,
  location_label text not null,
  capacity int not null,
  event_end timestamptz not null,
  certificates_released boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into event_config (id, event_name, date_label, time_label, location_label, capacity, event_end, certificates_released)
values (1, 'Conecta ADM Patos', '19 de novembro de 2026', '18h30', 'UNIFIP — Auditório', 120, '2026-11-19T21:30:00', false)
on conflict (id) do nothing;

alter table event_config enable row level security;

-- Qualquer visitante pode ler a configuração (é o que monta a página pública).
create policy "qualquer um pode ler a configuracao"
  on event_config for select
  to anon, authenticated
  using (true);

-- Só o admin autenticado pode alterar a configuração.
create policy "admin pode atualizar a configuracao"
  on event_config for update
  to authenticated
  using (true)
  with check (true);

-- 3) Função de inscrição (chamada pela página pública) -------------------
-- SECURITY DEFINER: roda com privilégio do dono da função, então
-- consegue inserir/atualizar mesmo com a RLS bloqueando INSERT direto.
-- Isso permite validar e-mail/nome aqui dentro, sem confiar só no navegador.
create or replace function register_attendee(p_name text, p_email text, p_institution text)
returns table (code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_code text;
begin
  if v_email is null or v_email = '' or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'E-mail inválido.';
  end if;
  if p_name is null or trim(p_name) = '' then
    raise exception 'Nome é obrigatório.';
  end if;

  select r.code into v_code from registrations r where r.email = v_email;

  if v_code is null then
    v_code := upper(substr(md5(random()::text), 1, 4)) || '-' || upper(substr(md5(clock_timestamp()::text), 1, 4));
    insert into registrations (email, name, institution, code)
    values (v_email, trim(p_name), nullif(trim(p_institution), ''), v_code);
  else
    update registrations set name = trim(p_name), institution = nullif(trim(p_institution), '')
    where email = v_email;
  end if;

  return query select v_code;
end;
$$;

grant execute on function register_attendee(text, text, text) to anon, authenticated;

-- 4) Função de consulta (usada na emissão do certificado) ----------------
-- Também SECURITY DEFINER: devolve nome/código de UM e-mail específico,
-- sem expor a lista completa de inscritos ao público.
create or replace function get_registration(p_email text)
returns table (name text, code text)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select r.name, r.code from registrations r where r.email = lower(trim(p_email));
end;
$$;

grant execute on function get_registration(text) to anon, authenticated;

-- 5) Contagem pública de inscritos (para o "vagas preenchidas" no herói) -
create or replace function count_registrations()
returns int
language sql
security definer
set search_path = public
as $$
  select count(*)::int from registrations;
$$;

grant execute on function count_registrations() to anon, authenticated;
