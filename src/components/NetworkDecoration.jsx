// SVG decorativo reutilizável, inspirado nos "pontos de conexão" da identidade visual.
// variant "corner": usado no cabeçalho (masthead). variant "wide": usado na faixa de encerramento.
export default function NetworkDecoration({ variant = 'corner', className }) {
  if (variant === 'wide') {
    return (
      <svg
        className={className}
        viewBox="0 0 340 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="30" cy="30" r="2.4" fill="var(--teal)" />
        <circle cx="90" cy="15" r="2.4" fill="var(--gold)" />
        <circle cx="150" cy="45" r="2.4" fill="var(--teal)" />
        <circle cx="220" cy="20" r="2.4" fill="var(--gold)" />
        <circle cx="290" cy="55" r="2.4" fill="var(--teal)" />
        <circle cx="60" cy="90" r="2.4" fill="var(--gold)" />
        <circle cx="180" cy="100" r="2.4" fill="var(--teal)" />
        <circle cx="260" cy="110" r="2.4" fill="var(--gold)" />
        <path d="M30 30 L90 15 L150 45 L220 20 L290 55" stroke="var(--teal)" strokeWidth="1" opacity="0.6" />
        <path d="M60 90 L150 45 L180 100 L260 110" stroke="var(--gold)" strokeWidth="1" opacity="0.6" />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      viewBox="0 0 420 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="60" cy="50" r="3" fill="var(--teal)" />
      <circle cx="150" cy="30" r="3" fill="var(--gold)" />
      <circle cx="240" cy="70" r="3" fill="var(--teal)" />
      <circle cx="330" cy="40" r="3" fill="var(--gold)" />
      <circle cx="100" cy="130" r="3" fill="var(--gold)" />
      <circle cx="210" cy="150" r="3" fill="var(--teal)" />
      <circle cx="320" cy="140" r="3" fill="var(--gold)" />
      <circle cx="60" cy="230" r="3" fill="var(--teal)" />
      <circle cx="180" cy="250" r="3" fill="var(--gold)" />
      <circle cx="290" cy="240" r="3" fill="var(--teal)" />
      <path d="M60 50 L150 30 L240 70 L330 40" stroke="var(--teal)" strokeWidth="1" />
      <path d="M100 130 L210 150 L320 140" stroke="var(--gold)" strokeWidth="1" />
      <path d="M60 230 L180 250 L290 240" stroke="var(--teal)" strokeWidth="1" />
      <path d="M150 30 L100 130 L60 230" stroke="var(--ink)" strokeWidth="1" opacity="0.4" />
      <path d="M240 70 L210 150 L180 250" stroke="var(--ink)" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
