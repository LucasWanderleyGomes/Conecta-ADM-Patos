import { supabase, supabaseEnabled } from './supabaseClient';
import { storeGet, storeSet, storeList, persistentStorageOK } from './storage';

function genCode() {
  return (
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    '-' +
    Date.now().toString(36).slice(-4).toUpperCase()
  );
}

// Faz a inscrição (ou atualiza uma já existente com o mesmo e-mail).
// Retorna { code, warn }. "warn" avisa quando os dados só estão sendo
// guardados na sessão atual (modo demonstração, sem Supabase configurado).
export async function registerAttendee({ name, email, institution }) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (supabaseEnabled) {
    const { data, error } = await supabase.rpc('register_attendee', {
      p_name: cleanName,
      p_email: cleanEmail,
      p_institution: institution
    });
    if (error) throw error;
    const code = Array.isArray(data) ? data[0]?.code : data?.code;
    return { code, warn: false };
  }

  const key = 'registrations:' + cleanEmail;
  let code = genCode();
  try {
    const existing = await storeGet(key);
    code = JSON.parse(existing.value).code;
  } catch (e) {
    // ainda não existe, mantém o código novo gerado acima
  }
  const record = { name: cleanName, email: cleanEmail, institution: institution.trim(), code, timestamp: Date.now() };
  await storeSet(key, JSON.stringify(record));
  return { code, warn: !persistentStorageOK };
}

// Busca uma inscrição por e-mail (usado na emissão do certificado).
// Lança erro se não encontrar.
export async function findRegistrationByEmail(email) {
  const cleanEmail = email.trim().toLowerCase();

  if (supabaseEnabled) {
    const { data, error } = await supabase.rpc('get_registration', { p_email: cleanEmail });
    const row = Array.isArray(data) ? data[0] : data;
    if (error || !row || !row.name) throw new Error('not-found');
    return { name: row.name, code: row.code };
  }

  const res = await storeGet('registrations:' + cleanEmail);
  return JSON.parse(res.value);
}

// Contagem pública de inscritos (para o contador no cabeçalho).
export async function countRegistrations() {
  if (supabaseEnabled) {
    const { data, error } = await supabase.rpc('count_registrations');
    if (error) return 0;
    return data ?? 0;
  }
  const list = await storeList('registrations:');
  return list.keys ? list.keys.length : 0;
}

// Lista completa de inscrições — só funciona autenticado como admin
// quando o Supabase está configurado (a RLS bloqueia o resto).
export async function listRegistrationsForAdmin() {
  if (supabaseEnabled) {
    const { data, error } = await supabase
      .from('registrations')
      .select('name,email,institution,code,created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map((r) => ({
      name: r.name,
      email: r.email,
      institution: r.institution,
      code: r.code,
      timestamp: new Date(r.created_at).getTime()
    }));
  }

  const list = await storeList('registrations:');
  const keys = list.keys || [];
  const results = [];
  for (const key of keys) {
    try {
      const res = await storeGet(key);
      results.push(JSON.parse(res.value));
    } catch (e) {
      // ignora chave corrompida ou inacessível
    }
  }
  results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  return results;
}
