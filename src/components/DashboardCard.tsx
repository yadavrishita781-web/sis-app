import { LucideIcon } from 'lucide-react';
import { cn } from '../utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
  subtitle?: string;
}

export function DashboardCard({
  title, value, icon: Icon, trend, trendUp = true, colorClass = 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400', subtitle
}: DashboardCardProps) {
  return (
    <div className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none pt-1">
            {value}
          </p>
          
          {subtitle && (
            <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
          )}

          {trend && (
            <div className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mt-2',
              trendUp ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}>
              <span>{trendUp ? '↑' : '↓'}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>

        {/* Icon Pill */}
        <div className={cn('p-3.5 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm', colorClass)}>
          <Icon className="h-6 w-6 stroke-[2]" />
        </div>

      </div>
    </div>
  );
}

