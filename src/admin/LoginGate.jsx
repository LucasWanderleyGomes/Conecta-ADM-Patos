import { useState } from 'react';
import { loginWithPassword } from '../lib/auth';
import { supabaseEnabled } from '../lib/supabaseClient';

export default function LoginGate({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function handleSubmit(ev) {
    ev.preventDefault();
    setChecking(true);
    setError('');
    try {
      await loginWithPassword({ email, password: pass });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Não foi possível entrar. Tente novamente.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="gate">
      <div className="gate-card">
        <h1>Administração do evento</h1>
        <p>Acesso restrito à coordenação.</p>
        <form onSubmit={handleSubmit}>
          {supabaseEnabled && (
            <div className="field">
              <label htmlFor="gate-email">E-mail</label>
              <input
                id="gate-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="gate-pass">Senha</label>
            <input
              id="gate-pass"
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }} disabled={checking}>
            {checking ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        {error && <div className="save-msg show error">{error}</div>}

        {supabaseEnabled ? (
          <div className="gate-note">
            Login real via Supabase Auth. Crie (ou redefina a senha de) um usuário administrador em
            Supabase → Authentication → Users.
          </div>
        ) : (
          <div className="gate-note">
            Modo demonstração (Supabase não configurado) — senha padrão:{' '}
            <span className="mono">admin123</span>. Altere depois na aba Configurações.
          </div>
        )}
      </div>
    </div>
  );
}
