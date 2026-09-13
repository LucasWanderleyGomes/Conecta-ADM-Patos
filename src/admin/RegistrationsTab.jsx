import { useEffect, useMemo, useState } from 'react';
import { listRegistrationsForAdmin } from '../lib/registrations';
import { eventIsOver } from '../lib/config';

function escapeCsvCell(value) {
  return '"' + String(value ?? '').replace(/"/g, '""') + '"';
}

export default function RegistrationsTab({ config }) {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState('');

  async function loadRegistrations() {
    setLoading(true);
    setLoadError(false);
    try {
      const results = await listRegistrationsForAdmin();
      setRegs(results);
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
    return regs.filter(
      (r) =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.institution || '').toLowerCase().includes(q)
    );
  }, [regs, query]);

  function exportCsv() {
    if (!regs.length) return;
    const rows = [['Nome', 'E-mail', 'Instituição', 'Código', 'Inscrito em']];
    regs.forEach((r) => {
      rows.push([r.name || '', r.email || '', r.institution || '', r.code || '', r.timestamp ? new Date(r.timestamp).toISOString() : '']);
    });
    const csv = rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
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
          placeholder="Buscar por nome, e-mail ou instituição"
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

      <table className="reg-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Instituição</th>
            <th>Código</th>
            <th>Inscrito em</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr className="empty-row">
              <td colSpan={5}>Carregando inscrições…</td>
            </tr>
          )}
          {!loading && !loadError && filtered.length === 0 && (
            <tr className="empty-row">
              <td colSpan={5}>Nenhuma inscrição encontrada.</td>
            </tr>
          )}
          {!loading &&
            filtered.map((r) => (
              <tr key={r.email}>
                <td data-label="Nome">{r.name || '—'}</td>
                <td data-label="E-mail">{r.email || '—'}</td>
                <td data-label="Instituição">{r.institution || '—'}</td>
                <td data-label="Código" className="mono">{r.code || '—'}</td>
                <td data-label="Inscrito em">{r.timestamp ? new Date(r.timestamp).toLocaleString('pt-BR') : '—'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
