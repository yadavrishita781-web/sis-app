import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { academicService } from '../../services/academicService';
import { studentService } from '../../services/studentService';
import { operationService } from '../../services/operationService';
import { Save, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '../../utils';

export function FacultyMarks() {
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => academicService.getSubjects()
  });

  const { data: students = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['adminStudents'],
    queryFn: () => studentService.getStudents()
  });

  const [subject, setSubject] = useState('');
  const [type, setType] = useState<'internal' | 'practical'>('internal');
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);

  const activeSubjectId = subject || subjects[0]?.id || '';

  const handleSave = async () => {
    if (!activeSubjectId) {
      alert("Please select a subject.");
      return;
    }

    try {
      for (const s of students) {
        const studentId = s.id || (s as any).user_id;
        const markVal = parseFloat(marks[studentId] || '0');

        if (type === 'internal') {
          await operationService.saveResult({
            studentId,
            studentName: s.name,
            subjectId: activeSubjectId,
            internalMarks: markVal
          });
        } else {
          await operationService.saveResult({
            studentId,
            studentName: s.name,
            subjectId: activeSubjectId,
            practicalMarks: markVal
          });
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(err.message || "Failed to save marks");
    }
  };

  const handlePublish = async () => {
    try {
      setPublished(true);
      setTimeout(() => setPublished(false), 2000);
    } catch (err: any) {
      alert("Failed to publish results");
    }
  };

  if (loadingSubjects || loadingStudents) {
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
          <h1 className="page-title">Marks Entry</h1>
          <p className="page-subtitle">Enter internal and practical marks</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePublish} className={cn('btn-secondary text-indigo-600', published && 'text-emerald-600')}>
            {published ? <><CheckCircle className="h-4 w-4" /> Published!</> : 'Publish Results'}
          </button>
          <button onClick={handleSave} className={cn('btn-primary', saved && 'bg-emerald-600 hover:bg-emerald-700')}>
            {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Marks</>}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="label">Subject</label>
            <select className="input" value={activeSubjectId} onChange={e => { setSubject(e.target.value); setMarks({}); }}>
              {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Marks Type</label>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {(['internal', 'practical'] as const).map(t => (
                <button key={t} onClick={() => { setType(t); setMarks({}); }}
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
          {students.map((s: any) => {
            const sid = s.id || s.user_id;
            return (
              <div key={sid} className="grid grid-cols-3 items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-700">{(s.name || 'S').charAt(0)}</div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.name}</span>
                </div>
                <span className="text-sm font-mono text-slate-500">{s.rollNo || s.roll_no}</span>
                <input
                  type="number" min="0" max={type === 'internal' ? 40 : 25}
                  className="input w-24 text-center"
                  value={marks[sid] ?? ''}
                  onChange={e => setMarks(prev => ({ ...prev, [sid]: e.target.value }))}
                  placeholder="–"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

