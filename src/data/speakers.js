// A lista de palestrantes agora é dinâmica (gerenciada pelo admin) —
// ver src/lib/speakers.js. Este arquivo guarda só os helpers visuais
// usados tanto na página pública quanto no admin.

export const AVATAR_COLORS = ['#0B1F3A', '#1769AA', '#F2B848', '#333A42'];

export function initials(name) {
  const clean = (name || '').replace(/^(Profa?\.|Dra?\.|Msc\.)\s*/i, '').trim().split(' ');
  const a = clean[0] ? clean[0][0] : '';
  const b = clean.length > 1 ? clean[clean.length - 1][0] : '';
  return (a + b).toUpperCase() || '?';
}