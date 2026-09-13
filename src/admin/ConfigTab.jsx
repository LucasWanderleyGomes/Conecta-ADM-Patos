import { useState } from 'react';
import { saveConfig } from '../lib/config';
import { changeLocalPassword } from '../lib/auth';
import { supabaseEnabled } from '../lib/supabaseClient';

function isoToLocalInput(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ConfigTab({ config, onConfigSaved }) {
  const [form, setForm] = useState({
    eventName: config.eventName,
    dateLabel: config.dateLabel,
    timeLabel: config.timeLabel,
    locationLabel: config.locationLabel,
    capacity: config.capacity,
    eventEndLocal: isoToLocalInput(config.eventEndISO),
    certificatesReleased: config.certificatesReleased
  });
  const [newPass, setNewPass] = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setMsg(null);

    if (!supabaseEnabled && (newPass || newPass2)) {
      if (newPass.length < 4) {
        setMsg({ type: 'error', text: 'A nova senha precisa ter pelo menos 4 caracteres.' });
        return;
      }
      if (newPass !== newPass2) {
        setMsg({ type: 'error', text: 'As senhas não coincidem.' });
        return;
      }
    }

    setSaving(true);
    try {
      const eventEndISO = form.eventEndLocal ? new Date(form.eventEndLocal).toISOString() : config.eventEndISO;
      const nextConfig = {
        eventName: form.eventName.trim() || config.eventName,
        dateLabel: form.dateLabel.trim() || config.dateLabel,
        timeLabel: form.timeLabel.trim() || config.timeLabel,
        locationLabel: form.locationLabel.trim() || config.locationLabel,
        capacity: Number(form.capacity) || config.capacity,
        eventEndISO,
        certificatesReleased: !!form.certificatesReleased
      };
      await saveConfig(nextConfig);
      if (!supabaseEnabled && newPass) {
        await changeLocalPassword(newPass);
      }
      setNewPass('');
      setNewPass2('');
      setMsg({ type: 'ok', text: 'Configurações salvas. A página do evento vai refletir essas alterações no próximo carregamento.' });
      onConfigSaved(nextConfig);
    } catch (e) {
      setMsg({ type: 'error', text: 'Não foi possível salvar agora. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <form className="config-form" onSubmit={handleSubmit}>
        <h2>Dados do evento</h2>

        <div className="field">
          <label htmlFor="cfg-name">Nome do evento</label>
          <input id="cfg-name" type="text" value={form.eventName} onChange={(e) => updateField('eventName', e.target.value)} required />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="cfg-date">Data (texto exibido)</label>
            <input id="cfg-date" type="text" placeholder="19 de novembro de 2026" value={form.dateLabel} onChange={(e) => updateField('dateLabel', e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="cfg-time">Horário (texto exibido)</label>
            <input id="cfg-time" type="text" placeholder="18h30" value={form.timeLabel} onChange={(e) => updateField('timeLabel', e.target.value)} required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="cfg-local">Local</label>
          <input id="cfg-local" type="text" value={form.locationLabel} onChange={(e) => updateField('locationLabel', e.target.value)} required />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="cfg-capacity">Vagas totais</label>
            <input id="cfg-capacity" type="number" min="1" value={form.capacity} onChange={(e) => updateField('capacity', e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="cfg-end">Data/hora de encerramento</label>
            <input id="cfg-end" type="datetime-local" value={form.eventEndLocal} onChange={(e) => updateField('eventEndLocal', e.target.value)} required />
          </div>
        </div>

        <div className="switch-row">
          <input
            type="checkbox"
            id="cfg-release"
            checked={form.certificatesReleased}
            onChange={(e) => updateField('certificatesReleased', e.target.checked)}
          />
          <div>
            <div className="t">Liberar certificados manualmente agora</div>
            <div className="d">
              Sobrepõe a data de encerramento — use se o evento já aconteceu mas ainda não passou da
              data/hora configurada.
            </div>
          </div>
        </div>

        {supabaseEnabled ? (
          <div className="security-note" style={{ marginTop: 0, marginBottom: 22 }}>
            A senha de administração agora é gerenciada pelo Supabase (Authentication → Users), não por
            aqui — crie ou redefina o usuário admin direto no painel do Supabase.
          </div>
        ) : (
          <>
            <h2 style={{ marginTop: 6 }}>Senha de administração</h2>
            <div className="field-row">
              <div className="field">
                <label htmlFor="cfg-newpass">Nova senha</label>
                <input id="cfg-newpass" type="password" placeholder="Deixe em branco para manter a atual" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="cfg-newpass2">Confirmar nova senha</label>
                <input id="cfg-newpass2" type="password" value={newPass2} onChange={(e) => setNewPass2(e.target.value)} />
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </button>
        {msg && <div className={`save-msg show ${msg.type}`}>{msg.text}</div>}
      </form>

      {!supabaseEnabled && (
        <div className="security-note">
          <b>Sobre a segurança deste painel:</b> como esta página roda inteiramente no navegador (sem
          servidor próprio), esta senha protege apenas contra acesso casual — qualquer pessoa com
          conhecimento técnico pode ler o código-fonte e contorná-la. Configure o Supabase (veja o
          README) para trocar isso por um login real.
        </div>
      )}
    </div>
  );
}
