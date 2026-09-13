import { supabase, supabaseEnabled } from './supabaseClient';
import { storeGet, storeSet } from './storage';

const LOCAL_PASSWORD_KEY = 'config:admin-password';
const DEFAULT_LOCAL_PASSWORD = 'admin123';
const LOCAL_SESSION_KEY = 'admin-authed';

export async function getSession() {
  if (supabaseEnabled) {
    const { data } = await supabase.auth.getSession();
    return data.session || null;
  }
  try {
    return sessionStorage.getItem(LOCAL_SESSION_KEY) === '1' ? { local: true } : null;
  } catch (e) {
    return null;
  }
}

// Em produção (Supabase configurado): login real por e-mail/senha,
// usando um usuário criado em Authentication > Users no painel do Supabase.
// Em modo demonstração: senha única, guardada localmente (ver config).
export async function loginWithPassword({ email, password }) {
  if (supabaseEnabled) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('E-mail ou senha incorretos.');
    return data.session;
  }

  let real = DEFAULT_LOCAL_PASSWORD;
  try {
    const res = await storeGet(LOCAL_PASSWORD_KEY);
    real = res.value;
  } catch (e) {
    // mantém a senha padrão se ainda não houver uma customizada
  }
  if (password !== real) throw new Error('Senha incorreta.');
  try {
    sessionStorage.setItem(LOCAL_SESSION_KEY, '1');
  } catch (e) {
    // sessionStorage pode não estar disponível; segue autenticado só nesta execução
  }
  return { local: true };
}

export async function logout() {
  if (supabaseEnabled) {
    await supabase.auth.signOut();
    return;
  }
  try {
    sessionStorage.removeItem(LOCAL_SESSION_KEY);
  } catch (e) {
    // ignora
  }
}

// Só existe no modo demonstração — em produção, a senha é gerenciada
// direto no painel do Supabase (Authentication > Users).
export async function changeLocalPassword(newPass) {
  if (supabaseEnabled) return;
  await storeSet(LOCAL_PASSWORD_KEY, newPass);
}
