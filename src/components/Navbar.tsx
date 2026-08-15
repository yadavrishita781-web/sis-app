import { Bell, LogOut, Sun, Moon, Menu, ChevronDown, Search, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useQuery } from '@tanstack/react-query';
import { operationService } from '../services/operationService';
import { formatDate } from '../utils';

interface NavbarProps {
  onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: notices = [], isLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: () => operationService.getNotices()
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const unread = notices.filter((n: any) => n.priority === 'high').length;

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-colors">
      {/* Left side: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Header Search Input matching reference image */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search anything..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 transition-all shadow-sm"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 transition-all relative shadow-sm"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-14 w-80 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">{notices.length} New</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="p-6 flex justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  </div>
                ) : notices.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-400 font-medium">No new notifications</div>
                ) : notices.slice(0, 4).map((n: any) => (
                  <div key={n.id} className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{n.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(n.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill matching reference image */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            className="flex items-center gap-3 p-1.5 pl-3.5 pr-2.5 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all shadow-sm"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-extrabold shadow-sm">
              {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:block text-left pr-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize mt-0.5 font-medium">{user?.role || 'Super Admin'}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 w-52 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

