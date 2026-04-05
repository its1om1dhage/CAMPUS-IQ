import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, ChevronRight, FileDigit } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Timeline from './Timeline';
import TableToolbar from './TableToolbar';

export default function SubmissionPanel({
  title,
  submissions,
  onApprove,
  onReject,
  canReview = false
}) {
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ search: '', year: '' });

  const filtered = useMemo(() => {
    return submissions.filter((item) => {
      const titleMatch = filters.search
        ? String(item.record?.title || '').toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const yearMatch = filters.year
        ? String(item.record?.year || '') === String(filters.year)
        : true;
      return titleMatch && yearMatch;
    });
  }, [submissions, filters]);

  const exportRows = filtered.map((item) => ({
    title: item.record?.title || '',
    year: item.record?.year || '',
    table: item.table_name,
    status: item.status,
    submitter: item.submitter?.full_name || item.submitter?.email || ''
  }));

  async function approve(item) {
    const remarks = window.prompt('Approval remarks', 'Approved');
    if (remarks === null) return;
    await onApprove(item.id, remarks);
    toast.success('Approved');
  }

  async function reject(item) {
    const remarks = window.prompt('Rejection remarks', 'Rejected');
    if (remarks === null) return;
    await onReject(item.id, remarks);
    toast.success('Rejected');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <TableToolbar title={title} rows={exportRows} filters={filters} setFilters={setFilters} />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Active Institutional Workflows</p>
            </div>
            <span className="inline-flex items-center justify-center rounded-lg bg-sky-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-700 ring-1 ring-sky-500/20">
              {filtered.length} Active Records
            </span>
          </div>

          <div className="space-y-3">
            {filtered.length ? filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all hover:shadow-sm cursor-pointer ${
                  selected?.id === item.id 
                    ? 'border-slate-800 bg-slate-50 shadow-sm ring-1 ring-inset ring-slate-800' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className={`text-[15px] font-bold ${selected?.id === item.id ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'} leading-tight`}>{item.record?.title || '-'}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <FileDigit size={12} className="text-slate-400"/>
                      <span className="uppercase tracking-widest">{item.table_name.replace('_', ' ')}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600">{item.submitter?.full_name || item.submitter?.email || '-'}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-slate-500 shadow-sm">
                      Year <span className="text-slate-900">{item.record?.year || '-'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-600 shadow-sm">
                      Phase <span className="text-slate-900">{item.current_reviewer_role || 'completed'}</span>
                    </span>
                  </div>

                  {canReview && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); approve(item); }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-500/30 transition-all hover:bg-emerald-500 hover:text-white"
                      >
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); reject(item); }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-700 ring-1 ring-inset ring-rose-500/30 transition-all hover:bg-rose-500 hover:text-white"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
                <div className="mb-3 rounded-lg bg-white shadow-sm ring-1 ring-slate-200 p-3">
                  <FileDigit size={20} className="text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-900">No submissions located.</p>
                <p className="text-xs font-semibold text-slate-500 mt-1 max-w-[250px]">Adjust search parameters or establish a new institutional record.</p>
              </div>
            )}
          </div>
        </div>

        <Timeline logs={selected?.logs || []} />
      </div>
    </div>
  );
}
