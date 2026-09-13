# Conecta ADM Patos

Landing page do evento + painel de administração, em Vite + React.

Funciona em dois modos, automaticamente:

- **Modo demonstração** (padrão, sem configurar nada): dados guardados só
  na sessão atual do navegador. Bom para testar e mexer no design.
- **Modo produção** (com Supabase configurado): banco de dados real,
  inscrições persistentes e login de admin de verdade.

## 1. Rodando localmente (modo demonstração)

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Admin em `http://localhost:5173/#/admin`
(senha padrão: `admin123`, altere na aba Configurações).

## 2. Configurando o Supabase (banco de dados real)

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e um
   novo projeto.
2. Vá em **SQL Editor → New query**, cole o conteúdo de
   `supabase/schema.sql` e rode. Isso cria as tabelas `registrations` e
   `event_config`, ativa Row Level Security e cria as funções que a
   aplicação usa (o público nunca lê a tabela de inscrições diretamente —
   só via funções que devolvem o mínimo necessário).
3. Vá em **Authentication → Users → Add user** e crie o usuário
   administrador (o e-mail e senha que você vai usar para entrar em
   `/#/admin`).
4. Vá em **Settings → API** e copie a **Project URL** e a **anon public
   key**.
5. Copie `.env.example` para `.env` e cole os dois valores:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon
   ```
6. Reinicie `npm run dev`. A partir daqui, a aplicação passa a usar o
   Supabase automaticamente — inscrições, configuração e login de admin
   tudo real. O aviso de "modo demonstração" some do login.

O `.env` não vai para o Git (já está no `.gitignore`) — as chaves ficam
só na sua máquina e, na hospedagem, são configuradas como variáveis de
ambiente do próprio serviço (veja o passo 4 abaixo).

## 3. Build para produção

```bash
npm run build
```

Gera a pasta `dist/`, pronta para publicar em qualquer hospedagem estática.

## 4. Publicando

### Opção A: Vercel ou Netlify (mais simples com variáveis de ambiente)
Conecte o repositório do GitHub, configure `VITE_SUPABASE_URL` e
`VITE_SUPABASE_ANON_KEY` nas variáveis de ambiente do projeto (na
hospedagem, não no `.env`), e o deploy acontece automaticamente a cada
push.

### Opção B: GitHub Pages
1. Suba este projeto para um repositório no GitHub.
2. Rode `npm run build` localmente (com o `.env` configurado) e publique
   o conteúdo de `dist/` na branch `gh-pages` (ou configure uma GitHub
   Action que faça isso a cada push, já com os secrets
   `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` configurados no
   repositório).
3. Em **Settings → Pages**, aponte para essa branch/pasta.
4. As rotas usam `HashRouter` (URLs como `/#/admin`) de propósito — isso
   evita configurar rewrites de servidor, que o GitHub Pages não suporta.

## Segurança

- A tabela de inscrições nunca é lida diretamente pelo público — só por
  duas funções (`get_registration`, `register_attendee`) que devolvem o
  mínimo necessário. A lista completa só aparece para quem está
  autenticado como admin.
- A senha de admin, em produção, é gerenciada pelo próprio Supabase
  Auth — não fica hardcoded em lugar nenhum do código.
- Nunca exponha a **service_role key** do Supabase no front-end — use
  sempre a **anon key**, que é protegida pelas políticas de RLS do
  `schema.sql`.

## Estrutura

```
src/
  components/   componentes da página pública
  admin/        componentes exclusivos do painel de administração
  pages/        EventPage (pública) e AdminPage
  lib/          storage (fallback local), registrations, config, auth,
                cliente do Supabase
  data/         palestrantes e programação (edite aqui)
  styles/       CSS global e do admin
supabase/
  schema.sql    script para rodar no SQL Editor do Supabase
```
