import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { academicService } from '../../services/academicService';
import { studentService } from '../../services/studentService';
import { attendanceService } from '../../services/attendanceService';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils';
import { Save, CheckCircle, Loader2 } from 'lucide-react';

export function FacultyAttendance() {
  const { user } = useAuth();
  
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => academicService.getSubjects()
  });

  const { data: students = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['adminStudents'],
    queryFn: () => studentService.getStudents()
  });

  const mySubjects = subjects.filter((s: any) => s.facultyId === user?.id || s.faculty_id === user?.id);

  const [subject, setSubject] = useState('');
  const activeSubjectId = subject || mySubjects[0]?.id || subjects[0]?.id || '';
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [saved, setSaved] = useState(false);

  const toggleStatus = (id: string) => {
    setAttendance(prev => {
      const current = prev[id] ?? 'absent';
      const next: Record<string, 'present' | 'absent' | 'late'> = {
        absent: 'present', present: 'late', late: 'absent',
      };
      return { ...prev, [id]: next[current] };
    });
  };

  const handleSave = async () => {
    if (!activeSubjectId) {
      alert("Please select a subject first.");
      return;
    }
    const currentSub = subjects.find((s: any) => s.id === activeSubjectId);
    const records = students.map((s: any) => ({
      studentId: s.id || s.user_id,
      studentName: s.name,
      subjectId: activeSubjectId,
      subjectName: currentSub?.name || '',
      date,
      status: attendance[s.id || s.user_id] ?? 'absent'
    }));

    try {
      await attendanceService.submitAttendance(records);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(err.message || "Failed to submit attendance");
    }
  };

  const present = Object.values(attendance).filter(v => v === 'present').length;
  const late = Object.values(attendance).filter(v => v === 'late').length;
  const absent = students.length - present - late;

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
            <select className="input" value={activeSubjectId} onChange={e => { setSubject(e.target.value); setAttendance({}); }}>
              {(mySubjects.length > 0 ? mySubjects : subjects).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
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
          <button onClick={() => { const all: Record<string,any> = {}; students.forEach((s: any) => { all[s.id || s.user_id] = 'present'; }); setAttendance(all); }} className="btn-secondary text-emerald-700 text-sm py-1.5">All Present</button>
          <button onClick={() => { const all: Record<string,any> = {}; students.forEach((s: any) => { all[s.id || s.user_id] = 'absent'; }); setAttendance(all); }} className="btn-secondary text-red-600 text-sm py-1.5">All Absent</button>
          <button onClick={() => setAttendance({})} className="btn-secondary text-sm py-1.5">Reset</button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-400 mb-3">Click to toggle: Absent → Present → Late → Absent</p>
          {students.map((s: any) => {
            const sid = s.id || s.user_id;
            const status = attendance[sid] ?? 'absent';
            return (
              <div key={sid} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold">{(s.name || 'S').charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.rollNo || s.roll_no}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(sid)}
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

