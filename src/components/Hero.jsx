import NetworkDecoration from './NetworkDecoration';
import { scrollToId } from '../lib/scroll';

function IconBadge({ children }) {
  return <span className="byline-icon">{children}</span>;
}

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 4.5c1.7.4 3 2 3 3.8 0 1.9-1.3 3.4-3 3.8M21.5 20c0-3-2-5.5-5-6.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Hero({ config, registeredCount }) {
  const vagasText =
    registeredCount === null
      ? `${config.capacity} disponíveis`
      : `${registeredCount} de ${config.capacity} preenchidas`;

  return (
    <header className="masthead" id="top">
      <NetworkDecoration variant="corner" className="masthead-net masthead-net-a" />
      <NetworkDecoration variant="corner" className="masthead-net masthead-net-b" />
      <div className="wrap">
        <div className="masthead-kicker">I Encontro de Estudantes de Administração de Patos</div>
        <h1>{config.eventName}</h1>
        <p className="sub">Universidade, profissão e mercado em conexão.</p>

        <div className="byline">
          <div className="byline-item">
            <IconBadge><CalendarIcon /></IconBadge>
            <div>
              <div className="label">Data</div>
              <div className="value">{config.dateLabel}</div>
            </div>
          </div>
          <div className="byline-item">
            <IconBadge><ClockIcon /></IconBadge>
            <div>
              <div className="label">Horário</div>
              <div className="value">{config.timeLabel}</div>
            </div>
          </div>
          <div className="byline-item">
            <IconBadge><PinIcon /></IconBadge>
            <div>
              <div className="label">Local</div>
              <div className="value">{config.locationLabel}</div>
            </div>
          </div>
          <div className="byline-item">
            <IconBadge><UsersIcon /></IconBadge>
            <div>
              <div className="label">Vagas</div>
              <div className="value">{vagasText}</div>
            </div>
          </div>
        </div>

        <div className="cta-row">
          <a href="#inscricao" className="btn btn-primary" onClick={(e) => { e.preventDefault(); scrollToId('inscricao'); }}>
            Fazer inscrição
          </a>
          <a href="#programacao" className="btn" onClick={(e) => { e.preventDefault(); scrollToId('programacao'); }}>
            Ver programação
          </a>
        </div>
      </div>
    </header>
  );
}