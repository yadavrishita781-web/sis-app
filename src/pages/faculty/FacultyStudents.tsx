import { useState } from 'react';
import { students, subjectAttendance } from '../../services/dummyData';
import { SearchBar } from '../../components/SearchBar';
import { getAttendanceColor } from '../../utils';
import { Eye } from 'lucide-react';
import { Modal } from '../../components/Modal';

export function FacultyStudents() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof students[0] | null>(null);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Students</h1>
          <p className="page-subtitle">{students.length} students in your assigned sections</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or roll no..." />
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Avg Attendance</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(s => {
                const avg = Math.round(subjectAttendance.reduce((sum, a) => sum + a.percentage, 0) / subjectAttendance.length);
                return (
                  <tr key={s.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell font-mono text-sm">{s.rollNo}</td>
                    <td className="table-cell">{s.section}</td>
                    <td className="table-cell">{s.department}</td>
                    <td className="table-cell">
                      <span className={`font-semibold ${getAttendanceColor(avg)}`}>{avg}%</span>
                    </td>
                    <td className="table-cell">
                      <button onClick={() => setSelected(s)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Student Profile" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                {selected.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{selected.name}</h3>
                <p className="text-slate-500">{selected.rollNo} · {selected.department} Sem {selected.semester}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              {[
                ['Email', selected.email], ['Phone', selected.phone],
                ['Section', selected.section], ['Batch', selected.batch],
                ['DOB', selected.dob], ['Gender', selected.gender],
                ['Parent', selected.parentName], ['Parent Phone', selected.parentPhone],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{l}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
