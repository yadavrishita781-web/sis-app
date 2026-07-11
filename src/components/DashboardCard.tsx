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
  title, value, icon: Icon, trend, trendUp, colorClass = 'bg-indigo-500', subtitle
}: DashboardCardProps) {
  return (
    <div className="card hover:shadow-card-hover transition-shadow duration-200 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
          )}
          {trend && (
            <p className={cn('mt-2 text-sm font-medium flex items-center gap-1',
              trendUp ? 'text-emerald-600' : 'text-red-500'
            )}>
              <span>{trendUp ? '↑' : '↓'}</span>
              {trend}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', colorClass)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}
