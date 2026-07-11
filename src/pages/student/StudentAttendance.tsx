import { subjectAttendance, attendanceHistory } from '../../services/dummyData';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate, getAttendanceColor } from '../../utils';

export function StudentAttendance() {
  const overall = Math.round(subjectAttendance.reduce((s, a) => s + a.percentage, 0) / subjectAttendance.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Track your attendance across all subjects</p>
        </div>
      </div>

      {/* Overall */}
      <div className="card bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-sm font-medium">Overall Attendance</p>
            <p className="text-5xl font-bold mt-1">{overall}%</p>
            <p className={`text-sm mt-2 font-medium ${overall >= 75 ? 'text-emerald-300' : 'text-red-300'}`}>
              {overall >= 85 ? '✓ Excellent standing' : overall >= 75 ? '⚠ Adequate — maintain above 75%' : '✗ Below threshold — attend more classes!'}
            </p>
          </div>
          <div className="relative h-24 w-24">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="white" strokeWidth="2.5"
                strokeDasharray={`${overall} ${100 - overall}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">{overall}%</span>
          </div>
        </div>
      </div>

      {/* Subject-wise */}
      <div className="card">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Subject-wise Attendance</h2>
        <div className="space-y-4">
          {subjectAttendance.map(sa => (
            <div key={sa.subjectId}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{sa.subjectName}</span>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500">{sa.present}/{sa.total} classes</span>
                  <span className={`font-bold ${getAttendanceColor(sa.percentage)}`}>{sa.percentage}%</span>
                </div>
              </div>
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${sa.percentage >= 85 ? 'bg-emerald-500' : sa.percentage >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${sa.percentage}%` }}
                />
              </div>
              {sa.percentage < 75 && (
                <p className="text-xs text-red-500 mt-1">
                  Need {Math.ceil((0.75 * sa.total - sa.present) / (1 - 0.75))} more classes to reach 75%
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="card">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Attendance History</h2>
        <div className="table-wrapper">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {attendanceHistory.map(r => (
                <tr key={r.id} className="table-row">
                  <td className="table-cell">{formatDate(r.date)}</td>
                  <td className="table-cell font-medium">{r.subjectName}</td>
                  <td className="table-cell"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
