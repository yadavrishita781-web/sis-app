import { useState } from 'react';
import { useMockDB } from '../../context/MockDB';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils';
import { Save, CheckCircle } from 'lucide-react';

export function FacultyAttendance() {
  const { state, markAttendance } = useMockDB();
  const { user } = useAuth();
  const [subject, setSubject] = useState(state.subjects[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [saved, setSaved] = useState(false);

  const mySubjects = state.subjects.filter(s => s.facultyId === 'F001' || s.facultyName === user?.name);
  const selectedSubject = state.subjects.find(s => s.id === subject);

  const toggleStatus = (id: string) => {
    setAttendance(prev => {
      const current = prev[id] ?? 'absent';
      const next: Record<string, 'present' | 'absent' | 'late'> = {
        absent: 'present', present: 'late', late: 'absent',
      };
      return { ...prev, [id]: next[current] };
    });
  };

  const handleSave = () => {
    const records = state.students.map(s => ({
      studentId: s.id,
      subjectId: subject,
      subjectName: selectedSubject?.name || '',
      date,
      status: attendance[s.id] ?? 'absent',
    }));
    markAttendance(records);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const present = Object.values(attendance).filter(v => v === 'present').length;
  const late = Object.values(attendance).filter(v => v === 'late').length;
  const absent = state.students.length - present - late;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mark Attendance</h1>
          <p className="page-subtitle">Record student attendance for your classes</p>
        </div>
        <button onClick={handleSave} className={cn('btn-primary', saved && 'bg-emerald-600 hover:bg-emerald-700')}>
          {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Attendance</>}
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="label">Subject</label>
            <select className="input" value={subject} onChange={e => { setSubject(e.target.value); setAttendance({}); }}>
              {(mySubjects.length > 0 ? mySubjects : state.subjects).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-6 text-sm mb-4">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" />Present: {present}</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" />Absent: {absent}</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" />Late: {late}</span>
        </div>

        <div className="flex gap-3 mb-4">
          <button onClick={() => { const all: Record<string,any> = {}; state.students.forEach(s => { all[s.id] = 'present'; }); setAttendance(all); }} className="btn-secondary text-emerald-700 text-sm py-1.5">All Present</button>
          <button onClick={() => { const all: Record<string,any> = {}; state.students.forEach(s => { all[s.id] = 'absent'; }); setAttendance(all); }} className="btn-secondary text-red-600 text-sm py-1.5">All Absent</button>
          <button onClick={() => setAttendance({})} className="btn-secondary text-sm py-1.5">Reset</button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-400 mb-3">Click to toggle: Absent → Present → Late → Absent</p>
          {state.students.map(s => {
            const status = attendance[s.id] ?? 'absent';
            return (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold">{s.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.rollNo}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(s.id)}
                  className={cn('px-4 py-1.5 rounded-full text-sm font-semibold transition-all',
                    status === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                    status === 'late'    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                                          'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
