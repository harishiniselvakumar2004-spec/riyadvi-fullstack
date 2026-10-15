import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, auth } from '../../lib/api';
import { usePageMeta } from '../../hooks/usePageMeta';
import Logo from '../../components/layout/Logo';

const STATUSES = ['new', 'contacted', 'qualified', 'closed'];
const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'contacts', label: 'Enquiries' },
  { key: 'consultations', label: 'Consultations' },
  { key: 'health-checkups', label: 'Health Checkups' },
  { key: 'lead-magnet', label: 'Lead Magnet' },
  { key: 'applications', label: 'Careers' },
];

const COLUMNS = {
  contacts: ['name', 'email', 'phone', 'company', 'requirement', 'message', 'created_at', 'status'],
  consultations: ['name', 'email', 'phone', 'company', 'topic', 'preferred_date', 'created_at', 'status'],
  'health-checkups': ['name', 'email', 'company', 'score', 'created_at', 'status'],
  'lead-magnet': ['name', 'company', 'email', 'phone', 'created_at', 'status'],
  applications: ['name', 'email', 'phone', 'position', 'resume_name', 'created_at', 'status'],
};

const fmt = (k, v, row) => {
  if (k === 'created_at') return new Date(v).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  return v ?? '—';
};

function Stat({ label, value, hint }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-2 font-display text-4xl font-semibold text-gold-gradient">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

function Overview({ stats }) {
  if (!stats) return <p className="text-zinc-400">Loading…</p>;
  const t = stats.totals; const max = Math.max(1, ...stats.trend.map((d) => d.total));
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Total enquiries" value={stats.totalEnquiries} hint={`${stats.newContacts} new`} />
        <Stat label="Consultations" value={t.consultations} />
        <Stat label="Health checkups" value={t.healthCheckups} />
        <Stat label="Lead magnet" value={t.leadMagnet} />
        <Stat label="Job applications" value={t.applications} />
      </div>
      <div className="glass mt-6 rounded-2xl p-6">
        <p className="text-sm font-medium text-white">Leads in the last 7 days</p>
        <div className="mt-6 flex h-40 items-end gap-3">
          {stats.trend.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-md bg-gradient-to-t from-gold/30 to-gold transition-all" style={{ height: `${(d.total / max) * 100}%`, minHeight: 4 }} title={`${d.total}`} />
              <span className="text-[10px] text-zinc-500">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Table({ collection }) {
  const [rows, setRows] = useState(null); const [err, setErr] = useState('');
  const load = useCallback(() => api.adminGet(`/admin/${collection}`).then((d) => setRows(d.items)).catch((e) => setErr(e.message)), [collection]);
  useEffect(() => { setRows(null); setErr(''); load(); }, [load]);

  const setStatus = async (id, status) => {
    await api.adminPatch(`/admin/${collection}/${id}/status`, { status });
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  };
  const resume = async (row) => {
    const blob = await api.fetchBlob(`/admin/applications/${row.id}/resume`);
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = row.resume_name || 'resume'; a.click();
  };

  if (err) return <p className="text-red-300">{err}</p>;
  if (!rows) return <p className="text-zinc-400">Loading…</p>;
  if (!rows.length) return <p className="text-zinc-400">No records yet.</p>;
  const cols = COLUMNS[collection];
  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
          <tr>{cols.map((c) => <th key={c} className="px-4 py-3 font-medium">{c.replace('_', ' ')}</th>)}{collection === 'applications' && <th className="px-4 py-3">Resume</th>}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-white/5 align-top hover:bg-white/[.02]">
              {cols.map((c) => (
                <td key={c} className="max-w-[260px] px-4 py-3 text-zinc-300">
                  {c === 'status'
                    ? <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="rounded-md border border-white/10 bg-ink-800 px-2 py-1 text-xs capitalize text-gold">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                    : <span className="line-clamp-3">{fmt(c, r[c], r)}</span>}
                </td>
              ))}
              {collection === 'applications' && <td className="px-4 py-3"><button onClick={() => resume(r)} className="text-gold hover:underline">Download</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  usePageMeta('Admin dashboard');
  const nav = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!auth.get()) return nav('/admin');
    api.adminGet('/admin/stats').then(setStats).catch(() => { auth.clear(); nav('/admin'); });
  }, [nav]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-ink-900">
        <div className="container-x flex items-center justify-between py-4">
          <Logo />
          <button onClick={() => { auth.clear(); nav('/admin'); }} className="text-sm text-zinc-400 hover:text-gold">Sign out</button>
        </div>
      </header>
      <div className="container-x py-10">
        <nav className="mb-8 flex flex-wrap gap-2" aria-label="Dashboard sections">
          {TABS.map((t) => <button key={t.key} onClick={() => setTab(t.key)} className={`rounded-full border px-4 py-2 text-sm transition ${tab === t.key ? 'border-gold bg-gold text-black' : 'border-white/15 text-zinc-300 hover:border-gold/50'}`}>{t.label}</button>)}
        </nav>
        {tab === 'overview' ? <Overview stats={stats} /> : <Table key={tab} collection={tab} />}
      </div>
    </div>
  );
}
