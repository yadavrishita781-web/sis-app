import { useQuery } from '@tanstack/react-query';
import { operationService } from '../../services/operationService';
import { formatDate } from '../../utils';
import { Bell, Loader2 } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { useState } from 'react';
import { Modal } from '../../components/Modal';

export function StudentNotices() {
  const [filter, setFilter] = useState<'all' | 'college' | 'department' | 'exam'>('all');
  const [preview, setPreview] = useState<any | null>(null);

  const { data: notices = [], isLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: () => operationService.getNotices()
  });

  const filtered = filter === 'all' 
    ? notices 
    : notices.filter((n: any) => (n.targetAudience || n.target_audience || 'all').toLowerCase() === filter.toLowerCase());


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notice Board</h1>
          <p className="page-subtitle">Important announcements and notifications ({notices.length} notices)</p>
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {(['all', 'college', 'department', 'exam'] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === t ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card text-center py-12"><p className="text-slate-400">No notices in this category</p></div>
        ) : filtered.map((n: any) => (
          <div key={n.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => setPreview(n)}>
            <div className="flex items-start gap-4">
              <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${
                n.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20' :
                n.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20' :
                'bg-slate-100 dark:bg-slate-700'
              }`}>
                <Bell className={`h-4 w-4 ${
                  n.priority === 'high' ? 'text-red-600' :
                  n.priority === 'medium' ? 'text-amber-600' :
                  'text-slate-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</h3>
                  <StatusBadge status={n.priority} />
                  <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full capitalize text-slate-500">{n.target_audience || 'All'}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{n.content}</p>
                <p className="text-xs text-slate-400 mt-2">Admin · {formatDate(n.created_at)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.title || ''} size="lg"
        footer={<button className="btn-secondary" onClick={() => setPreview(null)}>Close</button>}
      >
        {preview && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={preview.priority} />
              <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full capitalize text-slate-500">{preview.target_audience || 'All'}</span>
              <span className="text-xs text-slate-400">{formatDate(preview.created_at)}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{preview.content}</p>
            <p className="text-xs text-slate-400">Published by: Admin</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
