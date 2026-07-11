import { NavLink } from 'react-router-dom';
import { LucideIcon, X } from 'lucide-react';
import { cn } from '../utils';

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

export function Sidebar({ items, open, onClose, role }: SidebarProps) {
  const roleColors: Record<string, string> = {
    student: 'from-indigo-600 to-violet-600',
    faculty:  'from-emerald-600 to-teal-600',
    admin:    'from-rose-600 to-orange-600',
  };

  const gradient = roleColors[role] ?? 'from-indigo-600 to-violet-600';

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
          'fixed left-0 top-0 h-screen w-64 bg-slate-900 z-50 flex flex-col transition-transform duration-300 ease-in-out',
          'lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className={cn('p-6 bg-gradient-to-br', gradient)}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-white font-bold text-lg">SIS</span>
              </div>
              <p className="text-white/70 text-xs capitalize">{role} Portal</p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {items.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href.split('/').length <= 2}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:bg-white/8 hover:text-white'
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('h-4 w-4 flex-shrink-0 transition-colors', isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300')} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 text-center">SIS v1.0 © 2024</p>
        </div>
      </aside>
    </>
  );
}
