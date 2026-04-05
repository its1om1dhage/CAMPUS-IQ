import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navMap = {
  student: 'Student Dashboard',
  faculty: 'Faculty Dashboard',
  hod: 'HOD Dashboard',
  admin: 'Admin Dashboard',
  superadmin: 'Superadmin Dashboard'
};

export default function AppLayout({ title, children }) {
  const { profile, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 font-sans selection:bg-sky-600 selection:text-white">
      {/* Professional Mesh Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden bg-mesh opacity-60">
        <div className="absolute top-[-10%] left-[-10%] h-[800px] w-[800px] rounded-full bg-slate-300/30 mix-blend-multiply blur-[120px] animate-blob" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 leading-tight">University Systems</p>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl leading-tight">{title || navMap[profile?.role]}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-t border-slate-200 pt-3 md:border-0 md:pt-0">
            <div className="hidden items-center gap-3 rounded-lg bg-slate-50 px-3 py-1.5 ring-1 ring-slate-200 sm:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-slate-200">
                  <User size={14} className="text-slate-600" />
                </div>
                <div className="flex flex-col pr-2">
                  <span className="text-[13px] font-bold text-slate-900 leading-none mb-0.5">{profile?.full_name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">{profile?.role}</span>
                </div>
            </div>
            
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:bg-slate-950 focus:ring-4 focus:ring-slate-200"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1400px] px-4 py-8 animate-fade-in sm:px-8">
        {children}
      </main>
    </div>
  );
}
