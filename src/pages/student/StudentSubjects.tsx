import { useMockDB } from '../../context/MockDB';
import { BookOpen } from 'lucide-react';

export function StudentSubjects() {
  const { state } = useMockDB();

  // Group by department/semester
  const grouped = state.subjects.reduce<Record<string, typeof state.subjects>>((acc, sub) => {
    const key = `${sub.department} · Sem ${sub.semester}`;
    acc[key] = acc[key] || [];
    acc[key].push(sub);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Subjects</h1>
          <p className="page-subtitle">Enrolled subjects and faculty information ({state.subjects.length} subjects)</p>
        </div>
      </div>

      {Object.entries(grouped).map(([group, subs]) => (
        <div key={group} className="card">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-600" /> {group}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subs.map(s => (
              <div key={s.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{s.name}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">{s.code}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-medium">
                    {s.credits} Cr
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500">Faculty</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-0.5">{s.facultyName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {state.subjects.length === 0 && (
        <div className="card text-center py-12">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">No subjects enrolled</p>
        </div>
      )}
    </div>
  );
}
