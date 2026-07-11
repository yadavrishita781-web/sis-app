import { useState } from 'react';
import { FileText, Presentation, Video, Link as LinkIcon, Download } from 'lucide-react';
import { studyMaterials } from '../../services/dummyData';
import { formatDate } from '../../utils';
import { cn } from '../../utils';

const typeConfig = {
  pdf:   { icon: FileText,       label: 'PDF',        color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
  ppt:   { icon: Presentation,   label: 'PPT',        color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
  video: { icon: Video,          label: 'Video',      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  link:  { icon: LinkIcon,       label: 'Link',       color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
};

export function StudentMaterials() {
  const [filter, setFilter] = useState<'all' | 'pdf' | 'ppt' | 'video' | 'link'>('all');
  const filtered = filter === 'all' ? studyMaterials : studyMaterials.filter(m => m.type === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Study Material</h1>
          <p className="page-subtitle">Access all resources uploaded by your faculty</p>
        </div>
      </div>
      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pdf', 'ppt', 'video', 'link'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn('px-4 py-2 rounded-full text-sm font-medium capitalize transition-all border',
              filter === f
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
            )}
          >
            {f === 'all' ? 'All' : typeConfig[f].label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(m => {
          const cfg = typeConfig[m.type];
          return (
            <div key={m.id} className="card hover:shadow-card-hover transition-shadow flex items-start gap-4">
              <div className={cn('p-3 rounded-xl flex-shrink-0', cfg.color)}>
                <cfg.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{m.title}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{m.subjectName}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>{m.uploadedBy}</span>
                  <span>·</span>
                  <span>{formatDate(m.uploadedAt)}</span>
                  {m.size && <><span>·</span><span>{m.size}</span></>}
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0">
                <Download className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
