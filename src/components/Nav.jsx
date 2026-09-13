import { useState } from 'react';
import { scrollToId, scrollToTop } from '../lib/scroll';

const LINKS = [
  { id: 'palestrantes', label: 'Palestrantes' },
  { id: 'programacao', label: 'Programação' },
  { id: 'local', label: 'Local' },
  { id: 'inscricao', label: 'Inscrição' },
  { id: 'certificado', label: 'Certificado' }
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  function handleLinkClick(ev, id) {
    ev.preventDefault();
    setOpen(false);
    scrollToId(id);
  }

  function handleLogoClick(ev) {
    ev.preventDefault();
    scrollToTop();
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="nav-mark" href="#top" onClick={handleLogoClick}>
          <svg width="28" height="28" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="15" cy="15" r="10.5" stroke="var(--ink)" strokeWidth="2.4" />
            <circle cx="8" cy="10" r="2" fill="var(--teal)" />
            <circle cx="19" cy="9.5" r="2" fill="var(--teal)" />
            <circle cx="15" cy="21" r="2" fill="var(--gold)" />
            <line x1="8" y1="10" x2="19" y2="9.5" stroke="var(--teal)" strokeWidth="1.4" />
            <line x1="19" y1="9.5" x2="15" y2="21" stroke="var(--gold)" strokeWidth="1.4" />
          </svg>
          <span>
            Conecta ADM Patos
            <small>I Encontro de Estudantes de Administração</small>
          </span>
        </a>

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {LINKS.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} onClick={(ev) => handleLinkClick(ev, link.id)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className={`nav-burger ${open ? 'open' : ''}`}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
      </div>
    </nav>
  );
}
