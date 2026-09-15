import { useEffect, useState } from 'react';
import { loadSpeakers, saveSpeakers, uploadSpeakerPhoto, genSpeakerId } from '../lib/speakers';
import { initials } from '../data/speakers';

function blankSpeaker() {
  return { id: genSpeakerId(), name: '', role: '', talk: '', time: '', photoUrl: null };
}

export default function SpeakersTab() {
  const [speakers, setSpeakers] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadSpeakers().then(setSpeakers);
  }, []);

  function updateField(id, field, value) {
    setSpeakers((list) => list.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  async function persist(nextList, successText) {
    try {
      await saveSpeakers(nextList);
      setSpeakers(nextList);
      setMsg({ type: 'ok', text: successText });
    } catch (e) {
      setMsg({ type: 'error', text: 'Não foi possível salvar agora. Tente novamente.' });
    }
  }

  async function handleSaveRow(id) {
    const speaker = speakers.find((s) => s.id === id);
    if (!speaker.name.trim() || !speaker.talk.trim()) {
      setMsg({ type: 'error', text: 'Preencha ao menos o nome e o título da palestra antes de salvar.' });
      return;
    }
    setSavingId(id);
    await persist(speakers, `Dados de ${speaker.name} salvos.`);
    setSavingId(null);
  }

  async function handleRemove(id) {
    const speaker = speakers.find((s) => s.id === id);
    if (!window.confirm(`Remover ${speaker.name || 'este palestrante'} da lista?`)) return;
    const next = speakers.filter((s) => s.id !== id);
    await persist(next, 'Palestrante removido.');
  }

  async function handleMove(id, direction) {
    const index = speakers.findIndex((s) => s.id === id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= speakers.length) return;
    const next = [...speakers];
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
    await persist(next, 'Ordem atualizada.');
  }

  async function handleAdd() {
    const next = [...speakers, blankSpeaker()];
    setSpeakers(next);
    setMsg(null);
  }

  async function handlePhotoChange(id, file) {
    if (!file) return;
    setUploadingId(id);
    setMsg(null);
    try {
      const url = await uploadSpeakerPhoto(file);
      const next = speakers.map((s) => (s.id === id ? { ...s, photoUrl: url } : s));
      await persist(next, 'Foto atualizada.');
    } catch (e) {
      setMsg({ type: 'error', text: 'Não foi possível enviar a foto agora.' });
    } finally {
      setUploadingId(null);
    }
  }

  if (!speakers) {
    return <div className="skeleton" style={{ height: 200, borderRadius: 8 }} />;
  }

  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, textTransform: 'none', marginBottom: 22, maxWidth: '60ch' }}>
        Essa lista alimenta direto a seção de Palestrantes na página pública — nome, título da
        palestra, horário e foto de cada um.
      </p>

      {msg && <div className={`save-msg show ${msg.type}`} style={{ marginBottom: 18 }}>{msg.text}</div>}

      <div className="speaker-admin-list">
        {speakers.map((s, i) => (
          <div className="speaker-admin-card" key={s.id}>
            <div className="speaker-admin-photo">
              {s.photoUrl ? (
                <img src={s.photoUrl} alt={s.name || 'Palestrante'} />
              ) : (
                <div className="speaker-admin-photo-placeholder">{initials(s.name) || '?'}</div>
              )}
              <label className="btn speaker-admin-upload-btn">
                {uploadingId === s.id ? 'Enviando...' : 'Trocar foto'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploadingId === s.id}
                  onChange={(e) => handlePhotoChange(s.id, e.target.files?.[0])}
                />
              </label>
            </div>

            <div className="speaker-admin-fields">
              <div className="field-row">
                <div className="field">
                  <label>Nome</label>
                  <input
                    type="text"
                    value={s.name}
                    placeholder="Ex.: Profa. Dra. Helena Marques"
                    onChange={(e) => updateField(s.id, 'name', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Horário</label>
                  <input
                    type="text"
                    value={s.time}
                    placeholder="Ex.: 18h50 – 19h30"
                    onChange={(e) => updateField(s.id, 'time', e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label>Título da palestra</label>
                <input
                  type="text"
                  value={s.talk}
                  placeholder="Ex.: Empreendedorismo e inovação nos negócios"
                  onChange={(e) => updateField(s.id, 'talk', e.target.value)}
                />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Função / instituição (opcional)</label>
                <input
                  type="text"
                  value={s.role || ''}
                  placeholder="Ex.: Coordenação do Curso de Administração"
                  onChange={(e) => updateField(s.id, 'role', e.target.value)}
                />
              </div>
            </div>

            <div className="speaker-admin-actions">
              <button className="btn" title="Mover para cima" onClick={() => handleMove(s.id, -1)} disabled={i === 0}>
                ↑
              </button>
              <button className="btn" title="Mover para baixo" onClick={() => handleMove(s.id, 1)} disabled={i === speakers.length - 1}>
                ↓
              </button>
              <button className="btn btn-primary" onClick={() => handleSaveRow(s.id)} disabled={savingId === s.id}>
                {savingId === s.id ? 'Salvando...' : 'Salvar'}
              </button>
              <button className="btn btn-danger" onClick={() => handleRemove(s.id)}>
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={handleAdd}>
        + Adicionar palestrante
      </button>
    </div>
  );
}