import { useState } from 'react';
import { students, subjects } from '../../services/dummyData';
import { Save, CheckCircle } from 'lucide-react';
import { cn } from '../../utils';

export function FacultyMarks() {
  const [subject, setSubject] = useState(subjects[0].id);
  const [type, setType] = useState<'internal' | 'practical'>('internal');
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Marks Entry</h1>
          <p className="page-subtitle">Enter internal and practical marks</p>
        </div>
        <button onClick={handleSave} className={cn('btn-primary', saved && 'bg-emerald-600 hover:bg-emerald-700')}>
          {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Marks</>}
        </button>
      </div>
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div><label className="label">Subject</label>
            <select className="input" value={subject} onChange={e => setSubject(e.target.value)}>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div><label className="label">Marks Type</label>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {(['internal', 'practical'] as const).map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={cn('flex-1 py-2 text-sm font-medium capitalize transition-colors',
                    type === t ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-3 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Student</span><span>Roll No</span><span>Marks (Max: {type === 'internal' ? '40' : '25'})</span>
          </div>
          {students.map(s => (
            <div key={s.id} className="grid grid-cols-3 items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-700">{s.name.charAt(0)}</div>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.name}</span>
              </div>
              <span className="text-sm font-mono text-slate-500">{s.rollNo}</span>
              <input
                type="number" min="0" max={type === 'internal' ? 40 : 25}
                className="input w-24 text-center"
                value={marks[s.id] ?? ''}
                onChange={e => setMarks(prev => ({ ...prev, [s.id]: e.target.value }))}
                placeholder="--"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
