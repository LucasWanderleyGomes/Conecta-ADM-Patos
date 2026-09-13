import { useState } from 'react';
import { registerAttendee } from '../lib/registrations';

export default function RegisterForm({ config, registeredCount, onRegistered }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [status, setStatus] = useState(null); // { type: 'ok'|'error', text, code, warn }
  const [submitting, setSubmitting] = useState(false);

  const countLabel =
    registeredCount === null ? 'carregando…' : `${registeredCount} ${registeredCount === 1 ? 'inscrito' : 'inscritos'}`;

  async function handleSubmit(ev) {
    ev.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      setStatus({ type: 'error', text: 'Preencha nome e e-mail para continuar.' });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const { code, warn } = await registerAttendee({ name: cleanName, email: cleanEmail, institution });

      setStatus({
        type: 'ok',
        text: `Inscrição confirmada para ${cleanName}. Código de inscrição:`,
        code,
        warn
      });
      setName('');
      setEmail('');
      setInstitution('');
      onRegistered && onRegistered();
    } catch (err) {
      setStatus({ type: 'error', text: 'Não foi possível concluir a inscrição agora. Tente novamente em instantes.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="inscricao">
      <div className="wrap">
        <div className="sec-head">
          <h2>Inscrição</h2>
          <div className="count">{countLabel}</div>
        </div>
        <div className="register-wrap">
          <div className="register-info">
            <p>
              A inscrição é gratuita e garante seu lugar no evento. Guarde o código gerado após o envio
              — ele não é obrigatório, mas ajuda em caso de dúvidas.
            </p>
            <ul>
              <li>Emissão de certificado após o encerramento do evento</li>
              <li>Confirmação exibida imediatamente na tela</li>
              <li>Sem necessidade de cadastro prévio ou senha</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="reg-name">Nome completo</label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="reg-email">E-mail</label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="field-hint">Use o mesmo e-mail para emitir seu certificado depois.</div>
            </div>
            <div className="field">
              <label htmlFor="reg-inst">Instituição / Curso</label>
              <input
                id="reg-inst"
                type="text"
                autoComplete="organization"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Confirmar inscrição'}
            </button>

            {status && (
              <div className={`form-msg show ${status.type}`}>
                {status.text}
                {status.code && <span className="code-chip">{status.code}</span>}
                {status.warn && (
                  <>
                    <br />
                    <span style={{ fontSize: 12.5 }}>
                      Aviso: o armazenamento permanente não está disponível neste modo de visualização —
                      os dados ficam salvos apenas nesta sessão.
                    </span>
                  </>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
