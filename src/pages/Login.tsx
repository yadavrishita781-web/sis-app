import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2, BookOpen } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const QUICK_LOGINS = [
  { label: 'Student', email: 'rishita@sis.edu', password: 'student123' },
  { label: 'Faculty', email: 'suraj@sis.edu', password: 'faculty123' },
  { label: 'Admin', email: 'mukesh@sis.edu', password: 'admin123' },
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const ok = login(email, password);
    setLoading(false);
    if (!ok) { setError('Invalid username or password.'); return; }
    const user = JSON.parse(localStorage.getItem('sis_user') ?? '{}');
    navigate(`/${user.role}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#35524b] flex overflow-hidden font-sans">
      
      {/* Left side (White Curved Area) */}
      <div className="hidden lg:flex lg:w-7/12 relative bg-white rounded-br-[15rem] p-12 flex-col justify-between shadow-2xl z-10">
        
        {/* Floating decorations */}
        <div className="absolute top-20 left-40 w-16 h-16 bg-slate-100 rounded-full opacity-60 mix-blend-multiply blur-sm" />
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-slate-100 rounded-full opacity-60 mix-blend-multiply blur-sm" />
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-slate-100 rounded-full opacity-50 mix-blend-multiply blur-sm" />
        
        {/* Logo */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-white rounded-full shadow-lg ring-1 ring-slate-100 flex items-center justify-center text-[#35524b]">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div className="leading-tight">
            <h2 className="text-[#35524b] font-bold text-xl tracking-tight uppercase">Institute of</h2>
            <h2 className="text-[#35524b] font-bold text-xl tracking-tight uppercase">Technology</h2>
          </div>
        </div>

        {/* Center Illustration Area */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
           <div className="w-96 h-96 relative">
              {/* Central blob */}
              <div className="absolute inset-0 bg-[#d8ece8] opacity-60 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-pulse-slow" />
              {/* Illustration placeholder (using an icon for now as we don't have the image asset) */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <BookOpen className="w-48 h-48 text-[#35524b] opacity-90 drop-shadow-2xl mb-4" />
                <h3 className="text-2xl font-semibold text-[#35524b]">Student Information System</h3>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs text-slate-500 font-medium">© 2026 Institute of Technology</p>
          <p className="text-xs text-slate-400">Powered by Antigravity</p>
        </div>
      </div>

      {/* Right side (Dark Green Login Form) */}
      <div className="w-full lg:w-5/12 flex flex-col items-center justify-center p-8 relative z-0">
        
        <div className="w-full max-w-sm">
          <h1 className="text-4xl font-semibold text-white mb-10 tracking-tight">Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-slate-200 mb-2">Username</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-black/20 text-white placeholder-slate-400 border border-transparent focus:border-[var(--primary)] focus:bg-black/30 focus:outline-none transition-all"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-black/20 text-white placeholder-slate-400 border border-transparent focus:border-[var(--primary)] focus:bg-black/30 focus:outline-none transition-all"
                placeholder="Enter your password"
                required
              />
              <div className="flex justify-end mt-2">
                <a href="#" className="text-xs text-[var(--primary)] hover:text-white transition-colors">Forgot Password?</a>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center font-medium bg-red-500/10 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[var(--primary)] hover:bg-[#5ca093] text-white font-semibold rounded-full transition-all duration-200 shadow-lg disabled:opacity-70 mt-4 flex justify-center items-center gap-2"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-300">
              Don't have an account? <a href="#" className="text-[var(--primary)] hover:text-white transition-colors">Register Now</a>
            </p>
          </div>

          <div className="mt-16 text-center space-y-4">
             <a href="#" className="text-xs text-[var(--primary)] hover:text-white transition-colors block">Terms and Services</a>
             <p className="text-[10px] text-slate-400">Have a problem? Contact us at<br/><a href="#" className="text-[var(--primary)] hover:text-white">support@sis.edu</a></p>
          </div>

          {/* Quick Logins for demo purposes */}
          <div className="mt-8 flex justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            {QUICK_LOGINS.map(q => (
              <button
                key={q.label}
                onClick={() => { setEmail(q.email); setPassword(q.password); }}
                className="px-3 py-1 rounded-full bg-black/30 text-white text-[10px] uppercase font-bold tracking-wider hover:bg-black/50 transition-colors border border-white/10"
              >
                {q.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
