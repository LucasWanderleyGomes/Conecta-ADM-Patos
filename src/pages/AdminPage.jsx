import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginGate from '../admin/LoginGate';
import RegistrationsTab from '../admin/RegistrationsTab';
import CertificatesTab from '../admin/CertificatesTab';
import ConfigTab from '../admin/ConfigTab';
import { loadConfig, DEFAULT_CONFIG } from '../lib/config';
import { getSession, logout } from '../lib/auth';

const TABS = [
  { id: 'inscricoes', label: 'Inscrições' },
  { id: 'certificados', label: 'Certificados' },
  { id: 'configuracoes', label: 'Configurações' }
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [tab, setTab] = useState('inscricoes');

  useEffect(() => {
    getSession().then((session) => {
      setAuthed(!!session);
      setCheckingSession(false);
    });
  }, []);

  useEffect(() => {
    if (authed) loadConfig().then(setConfig);
  }, [authed]);

  async function handleLogout() {
    await logout();
    setAuthed(false);
  }

  if (checkingSession) {
    return <div className="admin-body" />;
  }

  if (!authed) {
    return (
      <div className="admin-body">
        <LoginGate onSuccess={() => setAuthed(true)} />
      </div>
    );
  }

  return (
    <div className="admin-body">
      <div className="topbar">
        <div className="topbar-inner">
          <div>
            <h1>Administração — {config.eventName}</h1>
            <div className="sub">Inscrições, configuração do evento e certificados</div>
          </div>
          <div className="topbar-actions">
            <Link className="btn" to="/">Ver página do evento</Link>
            <button className="btn" onClick={handleLogout}>Sair</button>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="tab-panel">
          {tab === 'inscricoes' && <RegistrationsTab config={config} />}
          {tab === 'certificados' && <CertificatesTab config={config} />}
          {tab === 'configuracoes' && <ConfigTab config={config} onConfigSaved={setConfig} />}
        </div>
      </div>
    </div>
  );
}
