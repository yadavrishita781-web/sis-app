import { useState } from 'react';
import { subjectAttendance, subjects } from '../../services/dummyData';
import { SearchBar } from '../../components/SearchBar';
import { getAttendanceColor } from '../../utils';
import { LockOpen } from 'lucide-react';

export function AdminAttendance() {
  const [search, setSearch] = useState('');
  const filtered = subjectAttendance.filter(sa => sa.subjectName.toLowerCase().includes(search.toLowerCase()));

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
                <th className="px-4 py-3 text-right">Avg Attendance</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(sa => {
                const sub = subjects.find(s => s.id === sa.subjectId);
                return (
                  <tr key={sa.subjectId} className="table-row">
                    <td className="table-cell font-medium">{sa.subjectName}</td>
                    <td className="table-cell">{sub?.facultyName ?? '-'}</td>
                    <td className="table-cell text-right">{sa.total}</td>
                    <td className="table-cell text-right">
                      <span className={`font-semibold ${getAttendanceColor(sa.percentage)}`}>{sa.percentage}%</span>
                    </td>
                    <td className="table-cell text-center">
                      <button className="btn-secondary py-1 px-2 text-xs">
                        <LockOpen className="h-3 w-3 mr-1" /> Unlock Register
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
