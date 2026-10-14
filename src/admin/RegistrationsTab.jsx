import { Fragment, useEffect, useMemo, useState } from 'react';
import { listRegistrationsForAdmin } from '../lib/registrations';
import { eventIsOver } from '../lib/config';
import { maskCpf, formatCpf, onlyDigits } from '../lib/cpf';

// Células que começam com = + - @ podem virar fórmula ao abrir o CSV no Excel
// (o campo "pergunta" é texto livre vindo do público). O apóstrofo neutraliza.
function csvCell(value) {
  let s = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

function ChipList({ items }) {
  if (!items || items.length === 0) return <span className="detail-empty">—</span>;
  return (
    <div className="chip-list">
      {items.map((item) => (
        <span className="chip" key={item}>{item}</span>
      ))}
    </div>
  );
}

export default function RegistrationsTab({ config }) {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState({});

  async function loadRegistrations() {
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
    loadRegistrations();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return regs;
    const qDigits = onlyDigits(q);
    return regs.filter(
      (r) =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.institution || '').toLowerCase().includes(q) ||
        (r.vinculo || '').toLowerCase().includes(q) ||
        (qDigits.length >= 3 && onlyDigits(r.cpf).includes(qDigits))
    );
  }, [regs, query]);

  function toggleRow(email) {
    setExpanded((cur) => ({ ...cur, [email]: !cur[email] }));
  }

  // O CSV leva o CPF completo (a coordenação precisa dele); a tela mostra mascarado.
  function exportCsv() {
    if (!regs.length) return;
    const rows = [
      ['Nome', 'CPF', 'E-mail', 'Vínculo', 'Instituição/Empresa/Organização', 'Dúvidas e preocupações', 'Quer descobrir', 'Pergunta a um profissional', 'Código', 'Inscrito em']
    ];
    regs.forEach((r) => {
      rows.push([
        r.name || '',
        r.cpf ? formatCpf(r.cpf) : '',
        r.email || '',
        r.vinculo || '',
        r.institution || '',
        (r.concerns || []).join('; '),
        (r.interests || []).join('; '),
        r.question || '',
        r.code || '',
        r.timestamp ? new Date(r.timestamp).toISOString() : ''
      ]);
    });
    const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inscricoes.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const remaining = Math.max(config.capacity - regs.length, 0);
  const released = eventIsOver(config);

  return (
    <div>
      <div className="stat-row">
        <div className="stat">
          <div className="num">{regs.length}</div>
          <div className="lbl">Inscritos</div>
        </div>
        <div className="stat">
          <div className="num">{remaining}</div>
          <div className="lbl">Vagas restantes</div>
        </div>
        <div className="stat">
          <div className="num">{released ? 'Liberados' : 'Bloqueados'}</div>
          <div className="lbl">Status dos certificados</div>
        </div>
      </div>

      <div className="panel-head">
        <input
          className="search"
          type="search"
          placeholder="Buscar por nome, e-mail, CPF, vínculo ou instituição"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" onClick={loadRegistrations}>Atualizar</button>
          <button className="btn" onClick={exportCsv}>Exportar CSV</button>
        </div>
      </div>

      {loadError && (
        <div className="form-msg show error">
          Não foi possível carregar as inscrições. Se você configurou o Supabase, confira se está
          logado com um usuário autenticado — a lista completa só é liberada para o admin.
        </div>
      )}

      <div className="table-scroll">
        <table className="reg-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>E-mail</th>
              <th>Vínculo</th>
              <th>Instituição</th>
              <th>Código</th>
              <th>Inscrito em</th>
              <th>Respostas</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="empty-row">
                <td colSpan={8}>Carregando inscrições…</td>
              </tr>
            )}
            {!loading && !loadError && filtered.length === 0 && (
              <tr className="empty-row">
                <td colSpan={8}>Nenhuma inscrição encontrada.</td>
              </tr>
            )}
            {!loading &&
              filtered.map((r) => (
                <Fragment key={r.email}>
                  <tr>
                    <td data-label="Nome">{r.name || '—'}</td>
                    <td data-label="CPF" className="cpf-cell">{maskCpf(r.cpf)}</td>
                    <td data-label="E-mail">{r.email || '—'}</td>
                    <td data-label="Vínculo">{r.vinculo || '—'}</td>
                    <td data-label="Instituição">{r.institution || '—'}</td>
                    <td data-label="Código" className="mono">{r.code || '—'}</td>
                    <td data-label="Inscrito em">{r.timestamp ? new Date(r.timestamp).toLocaleString('pt-BR') : '—'}</td>
                    <td data-label="Respostas">
                      <button className="toggle-btn" onClick={() => toggleRow(r.email)} aria-expanded={!!expanded[r.email]}>
                        {expanded[r.email] ? 'Ocultar' : 'Ver'}
                      </button>
                    </td>
                  </tr>
                  {expanded[r.email] && (
                    <tr className="detail-row">
                      <td colSpan={8} className="detail-cell">
                        <div className="detail-grid">
                          <div className="detail-block">
                            <h4>Dúvidas e preocupações</h4>
                            <ChipList items={r.concerns} />
                          </div>
                          <div className="detail-block">
                            <h4>Quer descobrir no evento</h4>
                            <ChipList items={r.interests} />
                          </div>
                          <div className="detail-block detail-wide">
                            <h4>Pergunta a um profissional</h4>
                            <p className="detail-question">{r.question || '—'}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
