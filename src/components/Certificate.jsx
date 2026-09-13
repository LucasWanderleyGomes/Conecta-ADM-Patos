import NetworkDecoration from './NetworkDecoration';

export default function Certificate({ name, config, code }) {
  const endDate = new Date(config.eventEndISO);
  const dateTop = isNaN(endDate.getTime()) ? '' : endDate.toLocaleDateString('pt-BR');

  return (
    <div className="certificate">
      <NetworkDecoration variant="wide" className="cert-net" />
      <div className="cert-top">
        <span className="cert-issuer">{config.eventName.toUpperCase()}</span>
        <span>{dateTop}</span>
      </div>
      <div className="cert-title">Certificado de Participação</div>
      <div className="cert-name">{name}</div>
      <div className="cert-body">
        Certificamos que <b>{name}</b> participou do <b>{config.eventName}</b>, realizado em{' '}
        {config.dateLabel}, em {config.locationLabel}, com carga horária de <b>3 horas</b>.
      </div>
      <div className="cert-bottom">
        <div className="cert-sign">
          <div className="line" />
          Coordenação do Evento
        </div>
        <div className="cert-id">Código: {code ? `CERT-${code}` : '—'}</div>
      </div>
    </div>
  );
}
