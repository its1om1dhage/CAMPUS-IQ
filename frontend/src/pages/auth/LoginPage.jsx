import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login, signup } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { profile, saveSession, refreshMe, roleToPath } = useAuth();

  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'student',
    department_id: '',
    year: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.role) {
      navigate(roleToPath(profile.role), { replace: true });
    }
  }, [profile, navigate, roleToPath]);

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = mode === 'login'
        ? await login({ email: form.email, password: form.password })
        : await signup(form);

      saveSession(response.session, response.profile);
      await refreshMe();
      toast.success(mode === 'login' ? 'Logged in' : 'Signup successful');
      navigate(roleToPath(response.profile?.role || 'student'), { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 font-sans selection:bg-sky-600 selection:text-white">
      {/* Subtle Corporate Background Mesh */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden bg-mesh opacity-60">
        <div className="absolute top-[-10%] left-[-10%] h-[800px] w-[800px] rounded-full bg-slate-300/30 mix-blend-multiply blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-sky-200/20 mix-blend-multiply blur-[100px] animate-blob [animation-delay:4s]" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] p-4 sm:p-8">
        <div className="mx-auto grid min-h-[600px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          
          {/* Left Hero Section (Enterprise Branding) */}
          <div className="flex flex-col justify-center animate-reveal">
            <div className="mb-8 inline-flex animate-fade-in items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <span className="block text-sm font-bold tracking-tight text-slate-900 leading-none">University Systems</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Global R&D Network</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-tight">
              Campus <span className="text-sky-700">Intelligence</span>
            </h1>
            
            <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
              The centralized governance platform for institutional research, multi-tiered approvals, and comprehensive academic analytics.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 animate-slide-up-delayed">
              {[
                { title: 'Data Integrity', desc: 'Immutable records for 16 standardized R&D tables', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                { title: 'Workflow Routing', desc: 'Secure escalations from Faculty to Administration', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' }
              ].map((feature, i) => (
                <div key={i} className="group overflow-hidden rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-200 backdrop-blur-md transition-all hover:bg-white hover:shadow-md">
                  <div className={`mb-3 inline-flex rounded-lg bg-slate-100 p-2 text-slate-700`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} /></svg>
                  </div>
                  <h3 className="mb-1.5 text-sm font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-xs font-semibold leading-relaxed text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Login Section (Enterprise Panel) */}
          <div className="glass-panel w-full rounded-[2rem] p-8 sm:p-10 animate-reveal [animation-delay:0.1s]">
            <div className="relative z-10">
              <div className="mb-8 border-b border-slate-200 pb-6 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
                <p className="mt-2 text-xs font-semibold text-slate-500">Access the institutional workflow interface</p>
              </div>

              <div className="mb-8 flex rounded-xl bg-slate-100 p-1">
                <button
                  className={`flex-1 rounded-lg px-4 py-2.5 text-xs font-bold transition-all duration-200 ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                  onClick={() => setMode('login')}
                  type="button"
                >
                  Staff / Student Login
                </button>
              </div>

              <form onSubmit={submit} className="space-y-5">
                {mode === 'signup' ? (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">Full Legal Name</label>
                      <input
                        value={form.full_name}
                        onChange={(e) => update('full_name', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                        placeholder="e.g., Jonathan Doe"
                      />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">Designation</label>
                        <input
                          value="Student"
                          disabled
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">Academic Year</label>
                        <input
                          type="number"
                          value={form.year}
                          onChange={(e) => update('year', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                          placeholder="2024"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">University Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                    placeholder="email@institution.edu"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Password</label>
                  </div>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                    placeholder="••••••••••••"
                  />
                </div>

                <button
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:bg-slate-950 disabled:opacity-50"
                >
                  {loading ? 'Authenticating Object...' : mode === 'login' ? 'Sign In' : 'Register Account'}
                </button>
              </form>

              <div className="mt-8 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  System access requires verified identity integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
