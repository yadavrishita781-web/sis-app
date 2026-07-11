import { useState } from 'react';
import { Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { assignments } from '../../services/dummyData';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils';
import { cn } from '../../utils';

export function StudentAssignments() {
  const [tab, setTab] = useState<'pending' | 'submitted' | 'graded'>('pending');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = assignments.filter(a => a.status === tab);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">Manage your assignments and submissions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        {(['pending', 'submitted', 'graded'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-md text-sm font-medium capitalize transition-all',
              tab === t
                ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            {t}
            <span className={cn('ml-2 text-xs px-1.5 py-0.5 rounded-full',
              tab === t ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
            )}>
              {assignments.filter(a => a.status === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Assignment cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-400">No {tab} assignments</p>
          </div>
        ) : filtered.map(a => (
          <div key={a.id} className="card">
            <div
              className="flex items-start justify-between gap-4 cursor-pointer"
              onClick={() => setExpanded(expanded === a.id ? null : a.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">{a.title}</h3>
                  <StatusBadge status={a.status} />
                </div>
                <p className="text-sm text-slate-500 mt-1">{a.subjectName} · {a.facultyName}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span>Due: {formatDate(a.dueDate)}</span>
                  <span>Max Marks: {a.maxMarks}</span>
                  {a.marksObtained !== undefined && <span className="text-emerald-600 font-semibold">Marks: {a.marksObtained}/{a.maxMarks}</span>}
                </div>
              </div>
              {expanded === a.id ? <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />}
            </div>
            {expanded === a.id && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
                <p className="text-sm text-slate-600 dark:text-slate-400">{a.description}</p>
                {a.feedback && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Faculty Feedback</p>
                    <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1">{a.feedback}</p>
                  </div>
                )}
                {a.status === 'pending' && (
                  <button className="btn-primary">
                    <Upload className="h-4 w-4" /> Upload Submission
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
