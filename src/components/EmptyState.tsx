import { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'No data found',
  description = 'There is nothing here yet.',
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
