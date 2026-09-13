import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se as variáveis de ambiente não estiverem configuradas, a aplicação
// continua funcionando normalmente em "modo demonstração" (dados salvos
// só na sessão atual, sem persistência real) — ver src/lib/storage.js,
// src/lib/registrations.js e src/lib/auth.js, que checam supabaseEnabled
// antes de decidir se falam com o Supabase ou com o fallback local.
export const supabaseEnabled = Boolean(url && anonKey);

export const supabase = supabaseEnabled ? createClient(url, anonKey) : null;
