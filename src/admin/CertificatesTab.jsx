import { useState } from 'react';
import { eventIsOver } from '../lib/config';
import Certificate from '../components/Certificate';

export default function CertificatesTab({ config }) {
  const [previewName, setPreviewName] = useState('');
  const [preview, setPreview] = useState(null);

  const released = eventIsOver(config);

  function handlePreview(ev) {
    ev.preventDefault();
    const clean = previewName.trim();
    if (!clean) return;
    setPreview(clean);
  }

  return (
    <div>
      <div className="stat-row">
        <div className="stat">
          <div className="num">{released ? 'Liberados' : 'Bloqueados'}</div>
          <div className="lbl">Status atual na página pública</div>
        </div>
        <div className="stat">
          <div className="num">{config.certificatesReleased ? 'Manual' : 'Automático'}</div>
          <div className="lbl">Modo de liberação</div>
        </div>
      </div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, textTransform: 'none', marginBottom: 28 }}>
        A liberação para o público segue a data de encerramento configurada, ou o botão de liberação
        manual — ambos ficam na aba <b>Configurações</b>. A ferramenta abaixo é só para a coordenação
        conferir a arte do certificado antes disso, sem afetar o que os inscritos veem.
      </p>

      <div className="preview-tool">
        <h2>Pré-visualizar certificado</h2>
        <p>
          Digite um nome para ver como o certificado fica, independentemente da data do evento. Isso
          não gera nem libera nada para o público — é só uma prévia visual para a coordenação.
        </p>
        <form className="preview-form" onSubmit={handlePreview}>
          <div className="field">
            <label htmlFor="preview-name">Nome para a prévia</label>
            <input
              id="preview-name"
              type="text"
              placeholder="Ex.: Maria da Silva"
              value={previewName}
              onChange={(e) => setPreviewName(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Pré-visualizar</button>
          {preview && (
            <button type="button" className="btn" onClick={() => setPreview(null)}>
              Limpar
            </button>
          )}
        </form>

        {preview && (
          <div className="preview-cert-wrap">
            <Certificate name={preview} config={config} code="PREVIEW" />
          </div>
        )}
      </div>
    </div>
  );
}
