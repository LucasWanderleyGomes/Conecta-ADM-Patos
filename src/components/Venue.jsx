export default function Venue({ config }) {
  return (
    <section id="local">
      <div className="wrap">
        <div className="sec-head">
          <h2>Local</h2>
        </div>
        <div className="venue">
          <div className="venue-card">
            <h3>{config.locationLabel}</h3>
            <div className="addr">Centro Universitário de Patos · Patos, PB</div>
            <ul className="venue-list">
              <li><b>Credenciamento</b> A partir das 18h00, no saguão de entrada.</li>
              <li><b>Estacionamento</b> Vagas gratuitas no pátio interno do campus.</li>
              <li><b>Acessibilidade</b> Rampa de acesso e assentos reservados na primeira fileira.</li>
              <li><b>Transporte</b> Ponto de ônibus a 5 minutos a pé do portão principal.</li>
            </ul>
          </div>
          <div className="venue-map">
            <span className="pin" />
            <span className="pin-label">{config.locationLabel} — Patos, PB</span>
          </div>
        </div>
      </div>
    </section>
  );
}
