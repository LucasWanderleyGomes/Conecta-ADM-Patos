import { useEffect, useState } from 'react';
import { loadSpeakers } from '../lib/speakers';
import { AVATAR_COLORS, initials } from '../data/speakers';

export default function Speakers() {
  const [speakers, setSpeakers] = useState(null);

  useEffect(() => {
    loadSpeakers().then(setSpeakers);
  }, []);

  return (
    <section id="palestrantes">
      <div className="wrap">
        <div className="sec-head">
          <h2>Palestrantes</h2>
          <div className="count">{speakers ? `${speakers.length} confirmados` : '\u00A0'}</div>
        </div>
        <div className="speakers">
          {!speakers && <div className="skeleton" style={{ height: 120, borderRadius: 8 }} />}
          {speakers &&
            speakers.map((s, i) => (
              <div className="speaker" key={s.id || s.name}>
                {s.photoUrl ? (
                  <img className="avatar avatar-photo" src={s.photoUrl} alt={s.name} />
                ) : (
                  <div className="avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                    {initials(s.name)}
                  </div>
                )}
                <div>
                  <div className="speaker-name">{s.name}</div>
                  {s.role && <div className="speaker-role">{s.role}</div>}
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