
const VENUE_LAT = -7.0198851;
const VENUE_LNG = -37.2789069;
const VENUE_MAPS_LINK = 'https://maps.app.goo.gl/J4L3dT1Qn4an5wcFA';

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
            <div className="addr">UNIFIP — Auditório Paulo Bonavides · Patos, PB</div>
            <ul className="venue-list">
              <li><b>Credenciamento</b> A partir das 18h00, no saguão de entrada.</li>
              <li><b>Estacionamento</b> Vagas gratuitas no pátio interno do campus.</li>
              <li><b>Acessibilidade</b> Rampa de acesso e assentos reservados na primeira fileira.</li>
              <li><b>Transporte</b> Ponto de ônibus a 5 minutos a pé do portão principal.</li>
            </ul>
          </div>
          <div className="venue-map">
            <iframe
              title="Mapa do local do evento"
              src={`https://www.google.com/maps?q=${VENUE_LAT},${VENUE_LNG}&z=17&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="venue-map-caption">
              <span>{config.locationLabel} — Patos, PB</span>
              <a href={VENUE_MAPS_LINK} target="_blank" rel="noopener noreferrer">
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}