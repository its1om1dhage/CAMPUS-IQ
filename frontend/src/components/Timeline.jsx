import { Clock3, Layers, MessagesSquare } from 'lucide-react';

export default function Timeline({ logs = [] }) {
  return (
    <div className="rounded-[2rem] bg-slate-50/50 p-6 ring-1 ring-slate-100 sm:p-8 animate-slide-up h-fit">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">Activity Timeline</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">History of approvals & remarks</p>
        </div>
        <div className="rounded-xl bg-indigo-100/50 p-2 text-indigo-600">
          <Layers size={20} />
        </div>
      </div>
      
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {logs.length ? logs.map((log) => (
          <div key={log.id} className="relative flex items-center gap-4 transition-all hover:translate-x-1">
            <div className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-blue-100">
              <Clock3 size={16} className="text-blue-500" />
            </div>
            <div className="min-w-0 flex-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-blue-100">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">{log.action}</p>
                <p className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="text-xs font-semibold text-indigo-600 capitalize">
                {log.actor_role || '-'}
              </p>
              
              <div className="mt-2 flex gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                <MessagesSquare size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs font-medium leading-relaxed text-slate-600">
                  {log.remarks || 'No remarks provided.'}
                </p>
              </div>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 py-10 text-center relative z-10">
            <Clock3 size={24} className="mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">No timeline items yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
