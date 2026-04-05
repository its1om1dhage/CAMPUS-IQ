import { Clock, CheckCircle2, XCircle, FileEdit, ArrowRightCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const map = {
    draft: { bg: 'bg-slate-100 text-slate-700 ring-slate-200', icon: FileEdit },
    pending_faculty: { bg: 'bg-amber-50 text-amber-700 ring-amber-500/30', icon: Clock },
    pending_hod: { bg: 'bg-sky-50 text-sky-700 ring-sky-500/30', icon: Clock },
    pending_admin: { bg: 'bg-violet-50 text-violet-700 ring-violet-500/30', icon: Clock },
    approved: { bg: 'bg-emerald-50 text-emerald-700 ring-emerald-500/30', icon: CheckCircle2 },
    rejected: { bg: 'bg-rose-50 text-rose-700 ring-rose-500/30', icon: XCircle },
    submitted: { bg: 'bg-blue-50 text-blue-700 ring-blue-500/30', icon: ArrowRightCircle }
  };

  const config = map[status] || { bg: 'bg-slate-50 text-slate-700 ring-slate-200', icon: FileEdit };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset capitalize shadow-sm transition-all hover:shadow-md ${config.bg}`}>
      <Icon size={14} className="opacity-80" />
      {String(status || '-').replaceAll('_', ' ')}
    </span>
  );
}
