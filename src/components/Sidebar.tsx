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
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-theme-sidebar z-50 flex flex-col transition-transform duration-300 ease-in-out',
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

        {/* User Profile Header */}
        <div className="flex flex-col items-center pt-10 pb-6">
          <div className="relative mb-4">
            <div className="h-20 w-20 rounded-full border-2 border-theme-accent overflow-hidden p-0.5">
              <div className="h-full w-full rounded-full bg-theme-bg flex items-center justify-center text-theme-sidebar font-bold text-2xl">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
            {/* Decorative arc from the image (simplified) */}
            <div className="absolute top-0 right-0 h-full w-full rounded-full border-t-2 border-r-2 border-transparent" />
          </div>
          <h2 className="text-white font-bold tracking-wide uppercase text-sm">
            {user?.name || 'ALEX JOHNSON'}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {user?.email || 'alex.johnson@gmail.com'}
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto pl-4 py-2 space-y-1">
          {items.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href.split('/').length <= 2}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) => cn(
                'flex items-center gap-4 pl-4 py-3 text-sm font-semibold transition-all duration-150 group rounded-l-full relative',
                isActive
                  ? 'nav-item-active'
                  : 'text-slate-300 hover:text-white'
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('h-5 w-5 flex-shrink-0 transition-colors z-10', isActive ? 'text-theme-accent' : 'text-slate-400 group-hover:text-slate-300')} />
                  <span className="z-10 tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer info (Active Users / Decor) - matching the image loosely */}
        <div className="p-6 mt-auto">
          <p className="text-[10px] font-bold text-theme-accent tracking-widest mb-3 uppercase">Active Users</p>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-theme-sidebar bg-slate-200 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="h-full w-full object-cover" />
              </div>
            ))}
            <div className="h-8 w-8 rounded-full border-2 border-theme-sidebar bg-theme-accent flex items-center justify-center text-[10px] font-bold text-white z-10">
              +70
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
