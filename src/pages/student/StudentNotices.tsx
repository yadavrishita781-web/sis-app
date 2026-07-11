import { useState } from 'react';
import { notices } from '../../services/dummyData';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils';
import { cn } from '../../utils';
import { Bell } from 'lucide-react';

export function StudentNotices() {
  const [filter, setFilter] = useState<'all' | 'college' | 'department' | 'exam'>('all');
  const filtered = filter === 'all' ? notices : notices.filter(n => n.type === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notices</h1>
          <p className="page-subtitle">College & department announcements</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {(['all', 'college', 'department', 'exam'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-4 py-2 rounded-full text-sm font-medium capitalize transition-all border',
              filter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
            )}>{f}</button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.map(n => (
          <div key={n.id} className="card hover:shadow-card-hover transition-shadow">
            <div className="flex items-start gap-4">
              <div className={cn('p-2.5 rounded-xl flex-shrink-0', n.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' : n.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-blue-100 dark:bg-blue-900/30')}>
                <Bell className={cn('h-5 w-5', n.priority === 'high' ? 'text-red-600' : n.priority === 'medium' ? 'text-amber-600' : 'text-blue-600')} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <StatusBadge status={n.priority} />
                    <span className="badge badge-gray capitalize">{n.type}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{n.content}</p>
                <p className="text-xs text-slate-400 mt-3">{n.publishedBy} · {formatDate(n.publishedAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
