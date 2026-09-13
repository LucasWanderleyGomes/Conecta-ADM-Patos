import { PROGRAM } from '../data/program';

export default function ProgramList() {
  return (
    <section id="programacao">
      <div className="wrap">
        <div className="sec-head">
          <h2>Programação</h2>
          <div className="count">18h30 – 21h30</div>
        </div>
        <div className="program">
          {PROGRAM.map((p, i) => (
            <div className="program-item" key={p.time + p.title}>
              <div className="program-time">{p.time}</div>
              <div className="program-num">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <div className="program-title">{p.title}</div>
                {p.meta && <div className="program-meta">{p.meta}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
