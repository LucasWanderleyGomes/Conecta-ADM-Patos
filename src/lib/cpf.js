// Utilidades de CPF: limpar, formatar, validar os dígitos e mascarar.

export function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

// Formata enquanto a pessoa digita: 12345678901 -> 123.456.789-01
export function formatCpf(value) {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Valida os dois dígitos verificadores (e rejeita sequências como 111.111.111-11).
export function isValidCpf(value) {
  const d = onlyDigits(value);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

  const check = (len) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return check(9) === Number(d[9]) && check(10) === Number(d[10]);
}

// Mostra só o começo e o fim: 123.***.***-01 (para a tela do admin).
export function maskCpf(value) {
  const d = onlyDigits(value);
  if (d.length !== 11) return '—';
  return `${d.slice(0, 3)}.***.***-${d.slice(9)}`;
}
