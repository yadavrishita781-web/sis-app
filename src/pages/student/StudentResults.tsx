import { semesterResults } from '../../services/dummyData';
import { StatusBadge } from '../../components/StatusBadge';
import { getGradeColor, cn } from '../../utils';

export function StudentResults() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Academic Results</h1>
          <p className="page-subtitle">Internal marks, external marks & GPA</p>
        </div>
      </div>

      {semesterResults.map(sem => (
        <div key={sem.semester} className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-200">Semester {sem.semester}</h2>
            <div className="flex gap-4">
              {sem.sgpa > 0 && (
                <>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">SGPA</p>
                    <p className="text-xl font-bold text-indigo-600">{sem.sgpa}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">CGPA</p>
                    <p className="text-xl font-bold text-violet-600">{sem.cgpa}</p>
                  </div>
                </>
              )}
              {sem.sgpa === 0 && (
                <span className="badge-yellow">Results Pending</span>
              )}
            </div>
          </div>
          <div className="table-wrapper">
            <table className="table-base">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3 text-center">Internal</th>
                  <th className="px-4 py-3 text-center">External</th>
                  <th className="px-4 py-3 text-center">Practical</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-center">Grade</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {sem.subjects.map(sub => (
                  <tr key={sub.subjectId} className="table-row">
                    <td className="table-cell font-medium">{sub.subjectName}</td>
                    <td className="table-cell text-center">{sub.internalMarks}</td>
                    <td className="table-cell text-center">{sub.externalMarks || '-'}</td>
                    <td className="table-cell text-center">{sub.practicalMarks || '-'}</td>
                    <td className="table-cell text-center font-semibold">{sub.totalMarks}/{sub.maxMarks}</td>
                    <td className="table-cell text-center">
                      <span className={cn('font-bold', getGradeColor(sub.grade))}>{sub.grade}</span>
                    </td>
                    <td className="table-cell text-center">
                      {sub.grade !== '-' ? <StatusBadge status={sub.status} /> : <span className="badge-gray">Pending</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
