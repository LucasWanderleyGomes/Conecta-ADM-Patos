import { supabase, supabaseEnabled } from './supabaseClient';
import { storeGet, storeSet, storeList, persistentStorageOK } from './storage';
import { onlyDigits } from './cpf';

function genCode() {
  return (
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    '-' +
    Date.now().toString(36).slice(-4).toUpperCase()
  );
}

// Erro com mensagem própria para mostrar à pessoa (ex.: "CPF inválido.").
function userError(message) {
  const e = new Error(message);
  e.userFacing = true;
  return e;
}

// Faz a inscrição (ou atualiza uma já existente com o mesmo e-mail).
// Retorna { code, warn }. "warn" avisa quando os dados só estão sendo
// guardados na sessão atual (modo demonstração, sem Supabase configurado).
export async function registerAttendee(data) {
  const email = data.email.trim().toLowerCase();
  const cpf = onlyDigits(data.cpf);
  const name = data.name.trim();
  const institution = data.institution.trim();
  const question = (data.question || '').trim();

  if (supabaseEnabled) {
    const { data: rows, error } = await supabase.rpc('register_attendee', {
      p_name: name,
      p_cpf: cpf,
      p_email: email,
      p_vinculo: data.vinculo,
      p_institution: institution,
      p_concerns: data.concerns,
      p_interests: data.interests,
      p_question: question,
      p_consent: data.consent === true
    });
    if (error) {
      // Mensagens que começam com "ERRO: " vêm das validações do banco e são
      // seguras para exibir; qualquer outra coisa vira mensagem genérica.
      const m = (error.message || '').match(/^ERRO: (.+)$/);
      throw m ? userError(m[1]) : new Error(error.message || 'rpc-failed');
    }
    // A função devolve o código como texto; aceitamos também lista/objeto por segurança.
    const first = Array.isArray(rows) ? rows[0] : rows;
    const code = first && typeof first === 'object' ? first.code : first;
    return { code: code || null, warn: false };
  }

  // Modo demonstração (sem Supabase): guarda por e-mail na sessão.
  const key = 'registrations:' + email;
  let code = genCode();
  try {
    const existing = JSON.parse((await storeGet(key)).value);
    if (existing.cpf && onlyDigits(existing.cpf) !== cpf) {
      throw userError('Este e-mail já está inscrito com outro CPF.');
    }
    code = existing.code;
  } catch (e) {
    if (e.userFacing) throw e;
    // ainda não existe: mantém o código novo
  }

  const record = {
    name,
    cpf,
    email,
    vinculo: data.vinculo,
    institution,
    concerns: data.concerns,
    interests: data.interests,
    question,
    code,
    timestamp: Date.now()
  };
  await storeSet(key, JSON.stringify(record));
  return { code, warn: !persistentStorageOK };
}

// Busca uma inscrição por e-mail + CPF (usado na emissão do certificado).
// Exigir os dois impede que alguém emita o certificado de outra pessoa só
// sabendo o e-mail dela. Lança erro se não encontrar.
export async function findRegistration(email, cpf) {
  const cleanEmail = email.trim().toLowerCase();
  const digits = onlyDigits(cpf);

  if (supabaseEnabled) {
    const { data, error } = await supabase.rpc('get_registration', {
      p_email: cleanEmail,
      p_cpf: digits
    });
    const row = Array.isArray(data) ? data[0] : data;
    if (error || !row || !row.name) throw new Error('not-found');
    return { name: row.name, code: row.code };
  }

  const res = await storeGet('registrations:' + cleanEmail);
  const record = JSON.parse(res.value);
  if (onlyDigits(record.cpf) !== digits) throw new Error('not-found');
  return record;
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
      .select('name,email,cpf,vinculo,institution,concerns,interests,question,code,created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map((r) => ({
      name: r.name,
      email: r.email,
      cpf: r.cpf,
      vinculo: r.vinculo,
      institution: r.institution,
      concerns: r.concerns || [],
      interests: r.interests || [],
      question: r.question,
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
