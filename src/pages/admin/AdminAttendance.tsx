import { useState, useMemo } from 'react';
import { useMockDB } from '../../context/MockDB';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { getAttendanceColor } from '../../utils';
import { LockOpen, Pencil, Save } from 'lucide-react';

export function AdminAttendance() {
  const { state, updateAttendanceRecord } = useMockDB();
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState<typeof state.subjectAttendance[0] | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return state.subjectAttendance.filter(sa => sa.subjectName.toLowerCase().includes(q));
  }, [state.subjectAttendance, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Reports</h1>
          <p className="page-subtitle">Monitor college-wide attendance metrics</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search subject..." />
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Faculty</th>
                <th className="px-4 py-3 text-right">Classes Held</th>
                <th className="px-4 py-3 text-right">Present</th>
                <th className="px-4 py-3 text-right">Avg Attendance</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(sa => {
                const sub = state.subjects.find(s => s.id === sa.subjectId);
                return (
                  <tr key={sa.subjectId} className="table-row">
                    <td className="table-cell font-medium">{sa.subjectName}</td>
                    <td className="table-cell">{sub?.facultyName ?? '–'}</td>
                    <td className="table-cell text-right">{sa.total}</td>
                    <td className="table-cell text-right">{sa.present}</td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${sa.percentage >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${sa.percentage}%` }} />
                        </div>
                        <span className={`font-semibold ${getAttendanceColor(sa.percentage)}`}>{sa.percentage}%</span>
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setEditModal(sa)} className="btn-secondary py-1 px-2 text-xs">
                          <Pencil className="h-3 w-3 mr-1" /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View detailed student attendance */}
      <div className="card">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Attendance Records</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {state.attendanceRecords.slice(0, 20).map(r => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500 w-24">{r.date}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{r.subjectName}</span>
                <span className="text-slate-500">({r.studentId})</span>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
