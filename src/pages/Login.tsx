import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

const QUICK_LOGINS = [
  { label: 'Student',  email: 'priya@sis.edu',  password: 'student123',  color: 'bg-indigo-600' },
  { label: 'Faculty',  email: 'ramesh@sis.edu', password: 'faculty123',  color: 'bg-emerald-600' },
  { label: 'Admin',    email: 'admin@sis.edu',  password: 'admin123',    color: 'bg-rose-600' },
];

export function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500)); // simulate async
    const ok = login(email, password);
    setLoading(false);
    if (!ok) { setError('Invalid email or password.'); return; }
    const user = JSON.parse(localStorage.getItem('sis_user') ?? '{}');
    navigate(`/${user.role}`, { replace: true });
  };

  const quickLogin = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <div className="w-full max-w-md relative z-10 animate-slide-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Student Portal</h1>
          <p className="text-slate-400 mt-2 text-sm">Sign in to access your dashboard</p>
        </div>

        {/* Quick login buttons */}
        <div className="flex gap-2 mb-6">
          {QUICK_LOGINS.map(q => (
            <button
              key={q.label}
              onClick={() => quickLogin(q.email, q.password)}
              className={`flex-1 py-2 rounded-lg text-white text-xs font-semibold ${q.color} hover:opacity-90 transition-opacity`}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="you@sis.edu"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-slate-400 text-center mb-3">Demo credentials</p>
            <div className="space-y-1.5">
              {QUICK_LOGINS.map(q => (
                <div key={q.label} className="flex justify-between text-xs text-slate-400 font-mono">
                  <span className="text-slate-300">{q.label}:</span>
                  <span>{q.email} / {q.password}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
