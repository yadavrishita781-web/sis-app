import { NavLink } from 'react-router-dom';
import { LucideIcon, X } from 'lucide-react';
import { cn } from '../utils';
import { useAuth } from '../hooks/useAuth';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: NavItem[];
  open: boolean;
  onClose: () => void;
  role: string;
}

export function Sidebar({ items, open, onClose }: SidebarProps) {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
          onClick={onClose}
        />
      )}
      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#111C38] via-[#172550] to-[#0A1226] text-white z-50 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800/60 shadow-xl',
          'lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-white/70 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Top SIS Logo Branding Header matching reference image */}
        <div className="px-6 pt-7 pb-6 flex items-center gap-3 border-b border-white/10">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-blue-500/30 ring-2 ring-white/20">
            SIS
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">SIS Portal</h1>
            <p className="text-[11px] text-slate-400 font-medium">Student Information System</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {items.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href.split('/').length <= 2}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) => cn(
                'flex items-center gap-3.5 px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-2xl group',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('h-5 w-5 flex-shrink-0 transition-colors', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200')} />
                  <span className="tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer User Profile Capsule */}
        <div className="p-4 m-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 capitalize truncate">{user?.role || 'Portal User'}</p>
          </div>
        </div>
      </aside>
    </>
  );
}

