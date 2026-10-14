import { useEffect, useMemo, useState } from 'react';
import { listRegistrationsForAdmin } from '../lib/registrations';

function formatDate(ts) {
  return ts ? new Date(ts).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '';
}


function buildText(items, showAuthor, title) {
  const body = items
    .map((q, i) => {
      const author = showAuthor
        ? `\n   — ${q.name}${q.vinculo ? ` (${q.vinculo})` : ''}`
        : '';
      return `${i + 1}. ${q.question}${author}`;
    })
    .join('\n\n');
  return `${title}\n\n${body}\n`;
}

export default function QuestionsTab({ config }) {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState('');
  const [showAuthor, setShowAuthor] = useState(true);
  const [notice, setNotice] = useState('');

  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      setRegs(await listRegistrationsForAdmin());
    } catch (e) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  // Só entra quem de fato escreveu uma pergunta (o campo é opcional).
  const withQuestion = useMemo(
    () => regs.filter((r) => r.question && r.question.trim()),
    [regs]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return withQuestion;
    return withQuestion.filter(
      (r) => r.question.toLowerCase().includes(q) || (r.name || '').toLowerCase().includes(q)
    );
  }, [withQuestion, query]);

  const title = `Perguntas para os profissionais — ${(config && config.eventName) || 'Conecta ADM Patos'}`;

  // Copiar e baixar usam a lista que está na tela (já filtrada) e respeitam
  // o botão "Mostrar quem perguntou" — útil para entregar aos palestrantes sem nomes.
  async function copyAll() {
    if (!filtered.length) return;
    try {
      await navigator.clipboard.writeText(buildText(filtered, showAuthor, title));
      setNotice('Lista copiada.');
    } catch (e) {
      setNotice('Não foi possível copiar. Use "Baixar .txt".');
    }
  }

  function downloadTxt() {
    if (!filtered.length) return;
    const blob = new Blob(['\uFEFF' + buildText(filtered, showAuthor, title)], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'perguntas-para-os-profissionais.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <p className="questions-summary">
        {loading
          ? 'Carregando perguntas…'
          : `${withQuestion.length} ${withQuestion.length === 1 ? 'pergunta recebida' : 'perguntas recebidas'} de ${regs.length} ${regs.length === 1 ? 'inscrito' : 'inscritos'}. Vêm do campo “Se pudesse fazer uma pergunta a um profissional de Administração, qual seria?”.`}
      </p>

      <div className="questions-toolbar">
        <input
          className="search"
          type="search"
          placeholder="Buscar na pergunta ou no nome"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="switch-inline">
          <input type="checkbox" checked={showAuthor} onChange={(e) => setShowAuthor(e.target.checked)} />
          Mostrar quem perguntou
        </label>
        <button className="btn" onClick={load}>Atualizar</button>
        <button className="btn" onClick={copyAll} disabled={!filtered.length}>Copiar lista</button>
        <button className="btn" onClick={downloadTxt} disabled={!filtered.length}>Baixar .txt</button>
      </div>
      {notice && <div className="copy-notice" role="status">{notice}</div>}

      {loadError && (
        <div className="form-msg show error">
          Não foi possível carregar as perguntas. Se você configurou o Supabase, confira se está
          logado com um usuário autenticado e se a migração 03 foi executada.
        </div>
      )}

      {!loading && !loadError && withQuestion.length === 0 && (
        <div className="questions-empty">Nenhuma pergunta recebida ainda.</div>
      )}
      {!loading && !loadError && withQuestion.length > 0 && filtered.length === 0 && (
        <div className="questions-empty">Nenhuma pergunta encontrada para essa busca.</div>
      )}

      <ol className="question-list">
        {filtered.map((q, i) => (
          <li className="question-card" key={q.email}>
            <div className="question-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="question-body">
              <p className="question-text">{q.question}</p>
              {showAuthor && (
                <div className="question-meta">
                  <strong>{q.name}</strong>
                  {q.vinculo ? ` · ${q.vinculo}` : ''}
                  {q.institution ? ` · ${q.institution}` : ''}
                </div>
              )}
            </div>
            <div className="question-date">{formatDate(q.timestamp)}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
