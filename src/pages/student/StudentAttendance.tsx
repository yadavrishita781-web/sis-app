import { useMockDB } from '../../context/MockDB';
import { getAttendanceColor } from '../../utils';
import { CalendarCheck, AlertTriangle } from 'lucide-react';

export function StudentAttendance() {
  const { state } = useMockDB();

  const overall = state.subjectAttendance.length > 0
    ? Math.round(state.subjectAttendance.reduce((s, a) => s + a.percentage, 0) / state.subjectAttendance.length)
    : 0;

  const atRisk = state.subjectAttendance.filter(sa => sa.percentage < 75);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Report</h1>
          <p className="page-subtitle">Track your attendance across all subjects</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className={`text-5xl font-bold mb-1 ${getAttendanceColor(overall)}`}>{overall}%</div>
          <p className="text-slate-500 text-sm">Overall Attendance</p>
          {overall < 75 && <p className="text-red-500 text-xs mt-1 flex items-center justify-center gap-1"><AlertTriangle className="h-3 w-3" /> Below minimum</p>}
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-emerald-600 mb-1">{state.subjectAttendance.filter(a => a.percentage >= 75).length}</div>
          <p className="text-slate-500 text-sm">Subjects on Track</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-red-500 mb-1">{atRisk.length}</div>
          <p className="text-slate-500 text-sm">Subjects at Risk</p>
        </div>
      </div>

      {atRisk.length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Attendance Alert</p>
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm">
            You are below 75% in: {atRisk.map(a => a.subjectName).join(', ')}. Immediate improvement required.
          </p>
        </div>
      )}

      {/* Per-subject */}
      <div className="card">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-indigo-600" /> Subject-wise Attendance
        </h2>
        <div className="space-y-4">
          {state.subjectAttendance.map(sa => (
            <div key={sa.subjectId}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{sa.subjectName}</span>
                  <span className="text-xs text-slate-400 ml-2">({sa.present}/{sa.total} classes)</span>
                </div>
                <div className="flex items-center gap-2">
                  {sa.percentage < 75 && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                  <span className={`text-sm font-bold ${getAttendanceColor(sa.percentage)}`}>{sa.percentage}%</span>
                </div>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${sa.percentage >= 85 ? 'bg-emerald-500' : sa.percentage >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${sa.percentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {sa.percentage < 75
                  ? `Need ${Math.ceil((0.75 * sa.total - sa.present) / 0.25)} more classes to reach 75%`
                  : `Can miss ${Math.floor((sa.present - 0.75 * sa.total) / 0.75)} more classes`
                }
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Records */}
      <div className="card">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Recent Attendance Records</h2>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {state.attendanceRecords.filter(r => r.studentId === 'S001').slice().reverse().slice(0, 15).map(r => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500 w-24">{r.date}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{r.subjectName}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                r.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                r.status === 'late' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              } capitalize`}>{r.status}</span>
            </div>
          ))}
          {state.attendanceRecords.filter(r => r.studentId === 'S001').length === 0 && (
            <p className="text-slate-400 text-center py-6">No attendance records yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
