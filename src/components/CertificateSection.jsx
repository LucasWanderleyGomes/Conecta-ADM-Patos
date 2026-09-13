import { useState } from 'react';
import { findRegistrationByEmail } from '../lib/registrations';
import { eventIsOver } from '../lib/config';
import Certificate from './Certificate';

export default function CertificateSection({ config }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const released = eventIsOver(config);

  async function handleSubmit(ev) {
    ev.preventDefault();
    setRecord(null);
    setStatus(null);

    if (!released) {
      setStatus({ type: 'error', text: 'Os certificados ainda não foram liberados. Eles ficam disponíveis após o encerramento do evento.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setStatus({ type: 'error', text: 'Informe o e-mail usado na inscrição.' });
      return;
    }

    setLoading(true);
    try {
      const found = await findRegistrationByEmail(cleanEmail);
      setRecord(found);
      setStatus({ type: 'ok', text: `Certificado gerado com sucesso para ${found.name}.` });
    } catch (err) {
      setStatus({
        type: 'error',
        text: 'Não encontramos uma inscrição com esse e-mail. Verifique o endereço ou inscreva-se na seção acima.'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="certificado">
      <div className="wrap">
        <div className="sec-head">
          <h2>Certificado de participação</h2>
        </div>
        <div className="cert-panel">
          <div className="cert-status">
            <span className={`dot ${released ? 'live' : ''}`} />
            <span>
              {released
                ? config.certificatesReleased
                  ? 'Certificados liberados pela administração.'
                  : 'Evento encerrado — geração de certificados liberada.'
                : `Certificados disponíveis a partir de ${config.dateLabel}, após o encerramento do evento.`}
            </span>
          </div>

          <p style={{ color: 'var(--ink-soft)', fontSize: 14.5, maxWidth: '60ch', textTransform: 'none' }}>
            Informe o e-mail usado na inscrição para gerar seu certificado. O nome exibido é o mesmo
            enviado no formulário de inscrição.
          </p>

          <form className="cert-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="cert-email">E-mail da inscrição</label>
              <input
                id="cert-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Verificando...' : 'Gerar certificado'}
            </button>
          </form>

          {status && <div className={`form-msg show ${status.type}`}>{status.text}</div>}

          {record && (
            <>
              <div style={{ marginTop: 32 }}>
                <Certificate name={record.name} config={config} code={record.code} />
              </div>
              <div className="cert-actions">
                <button className="btn" onClick={() => window.print()}>
                  Salvar como PDF / Imprimir
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
