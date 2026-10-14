import { Link } from 'react-router-dom';
import NetworkDecoration from './NetworkDecoration';
import { scrollToId } from '../lib/scroll';

export default function Hero({ config, registeredCount }) {
  const vagasText =
    registeredCount === null
      ? `${config.capacity} disponíveis`
      : `${registeredCount} de ${config.capacity} preenchidas`;

  return (
    <header className="masthead" id="top">
      <NetworkDecoration variant="corner" className="masthead-net" />
      <div className="wrap">
        <div className="masthead-kicker">I Encontro de Estudantes de Administração de Patos</div>
        <h1>{config.eventName}</h1>
        <p className="sub">Universidade, profissão e mercado em conexão.</p>

        <div className="byline">
          <div className="byline-item">
            <div className="label">Data</div>
            <div className="value">{config.dateLabel}</div>
          </div>
          <div className="byline-item">
            <div className="label">Horário</div>
            <div className="value">{config.timeLabel}</div>
          </div>
          <div className="byline-item">
            <div className="label">Local</div>
            <div className="value">{config.locationLabel}</div>
          </div>
          <div className="byline-item">
            <div className="label">Vagas</div>
            <div className="value">{vagasText}</div>
          </div>
        </div>

        <div className="cta-row">
          <Link to="/inscricao" className="btn btn-primary">
            Fazer inscrição
          </Link>
          <a href="#programacao" className="btn" onClick={(e) => { e.preventDefault(); scrollToId('programacao'); }}>
            Ver programação
          </a>
        </div>
      </div>
    </header>
  );
}
