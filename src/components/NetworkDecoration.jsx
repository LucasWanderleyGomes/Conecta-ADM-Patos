// SVG decorativo reutilizável, inspirado no elemento "rede de conexões" da
// identidade visual: uma malha única de nós conectados (sem grupos soltos).
// variant "corner": usado no cabeçalho (masthead), mais densa.
// variant "wide": usado na faixa de encerramento e no certificado, mais rala.

const TEAL = 'var(--teal)';
const GOLD = 'var(--gold)';
const HUB = 'var(--white)';

// Malha "corner": construída como uma grade levemente irregular de 4 colunas
// x 5 linhas, toda conectada horizontal e verticalmente — isso garante que
// nunca fica um grupo de pontos solto no meio do nada.
const CORNER_NODES = [
  { x: 46, y: 44, r: 2.6, c: GOLD },
  { x: 150, y: 26, r: 2.6, c: TEAL },
  { x: 258, y: 50, r: 3.6, c: HUB },
  { x: 366, y: 30, r: 2.6, c: GOLD },

  { x: 90, y: 116, r: 2.6, c: TEAL },
  { x: 196, y: 96, r: 3.6, c: HUB },
  { x: 300, y: 122, r: 2.6, c: GOLD },
  { x: 396, y: 100, r: 2.6, c: TEAL },

  { x: 50, y: 196, r: 2.6, c: GOLD },
  { x: 156, y: 180, r: 2.6, c: TEAL },
  { x: 250, y: 204, r: 3.6, c: HUB },
  { x: 356, y: 186, r: 2.6, c: GOLD },

  { x: 96, y: 268, r: 2.6, c: TEAL },
  { x: 200, y: 288, r: 2.6, c: GOLD },
  { x: 306, y: 264, r: 2.6, c: TEAL },

  { x: 60, y: 340, r: 2.2, c: GOLD },
  { x: 168, y: 356, r: 2.2, c: TEAL },
  { x: 270, y: 336, r: 2.2, c: GOLD }
];

const CORNER_EDGES = [
  [0, 1, TEAL], [1, 2, GOLD], [2, 3, TEAL],
  [4, 5, GOLD], [5, 6, TEAL], [6, 7, GOLD],
  [8, 9, TEAL], [9, 10, GOLD], [10, 11, TEAL],
  [12, 13, GOLD], [13, 14, TEAL],
  [15, 16, TEAL], [16, 17, GOLD],
  [0, 4, GOLD], [1, 5, TEAL], [2, 6, GOLD], [3, 7, TEAL],
  [4, 8, TEAL], [5, 9, GOLD], [6, 10, TEAL], [7, 11, GOLD],
  [8, 12, GOLD], [9, 13, TEAL], [10, 14, GOLD],
  [12, 15, TEAL], [13, 16, GOLD], [14, 17, TEAL]
];

const WIDE_NODES = [
  { x: 20, y: 40, r: 2.4, c: TEAL },
  { x: 80, y: 18, r: 2.4, c: GOLD },
  { x: 140, y: 46, r: 3.2, c: HUB },
  { x: 200, y: 20, r: 2.4, c: TEAL },
  { x: 262, y: 50, r: 2.4, c: GOLD },
  { x: 320, y: 24, r: 2.4, c: TEAL },
  { x: 50, y: 100, r: 2.4, c: GOLD },
  { x: 112, y: 112, r: 2.4, c: TEAL },
  { x: 178, y: 96, r: 3.2, c: HUB },
  { x: 236, y: 116, r: 2.4, c: GOLD },
  { x: 300, y: 98, r: 2.4, c: TEAL }
];

const WIDE_EDGES = [
  [0, 1, TEAL], [1, 2, GOLD], [2, 3, TEAL], [3, 4, GOLD], [4, 5, TEAL],
  [6, 7, GOLD], [7, 8, TEAL], [8, 9, GOLD], [9, 10, TEAL],
  [0, 6, GOLD], [1, 7, TEAL], [2, 8, GOLD], [3, 8, TEAL], [4, 9, GOLD], [5, 10, TEAL]
];

function Mesh({ nodes, edges }) {
  return (
    <>
      {edges.map(([a, b, color], i) => (
        <line
          key={`e${i}`}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke={color}
          strokeWidth="1"
          opacity="0.55"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill={n.c} />
      ))}
    </>
  );
}

export default function NetworkDecoration({ variant = 'corner', className }) {
  if (variant === 'wide') {
    return (
      <svg className={className} viewBox="0 0 340 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <Mesh nodes={WIDE_NODES} edges={WIDE_EDGES} />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 420 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <Mesh nodes={CORNER_NODES} edges={CORNER_EDGES} />
    </svg>
  );
}