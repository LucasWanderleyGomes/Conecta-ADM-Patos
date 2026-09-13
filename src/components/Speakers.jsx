import { SPEAKERS, AVATAR_COLORS, initials } from '../data/speakers';

export default function Speakers() {
  return (
    <section id="palestrantes">
      <div className="wrap">
        <div className="sec-head">
          <h2>Palestrantes</h2>
          <div className="count">{SPEAKERS.length} confirmados</div>
        </div>
        <div className="speakers">
          {SPEAKERS.map((s, i) => (
            <div className="speaker" key={s.name}>
              <div className="avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                {initials(s.name)}
              </div>
              <div>
                <div className="speaker-name">{s.name}</div>
                <div className="speaker-role">{s.role}</div>
              </div>
              <div className="speaker-talk">
                <strong>{s.talk}</strong>
              </div>
              <div className="speaker-time">{s.time}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
