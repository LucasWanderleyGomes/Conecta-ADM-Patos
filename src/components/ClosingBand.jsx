import NetworkDecoration from './NetworkDecoration';

export default function ClosingBand() {
  return (
    <section className="closing-band">
      <div className="wrap closing-inner">
        <NetworkDecoration variant="wide" className="closing-net" />
        <h2 className="closing-title">
          Conectar hoje.
          <br />
          Transformar amanhã.
        </h2>
        <div className="closing-pillars">
          <span>Universidade</span>
          <span className="sep">•</span>
          <span>Profissão</span>
          <span className="sep">•</span>
          <span>Mercado</span>
        </div>
      </div>
    </section>
  );
}
