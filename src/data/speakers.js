export const AVATAR_COLORS = ['#0B1F3A', '#1769AA', '#F2B848', '#333A42'];

export const SPEAKERS = [
  {
    name: 'Profa. Dra. Helena Marques',
    role: 'Coordenação do Curso de Administração',
    talk: 'Empreendedorismo e inovação nos negócios',
    time: '18h50 – 19h30'
  },
  {
    name: 'Prof. Dr. Renato Cavalcanti',
    role: 'Núcleo de Estudos em Gestão',
    talk: 'Mercado de trabalho para administradores',
    time: '19h35 – 20h15'
  },
  {
    name: 'Msc. Camila Duarte',
    role: 'Consultora de RH convidada',
    talk: 'Gestão de pessoas na era digital',
    time: '20h20 – 21h00'
  },
  {
    name: 'Prof. Dr. Ícaro Bezerra',
    role: 'Egresso e empresário local',
    talk: 'Do TCC à carreira: primeiros passos profissionais',
    time: '21h05 – 21h30'
  }
];

export function initials(name) {
  const clean = name.replace(/^(Profa?\.|Dra?\.|Msc\.)\s*/i, '').trim().split(' ');
  const a = clean[0] ? clean[0][0] : '';
  const b = clean.length > 1 ? clean[clean.length - 1][0] : '';
  return (a + b).toUpperCase();
}
