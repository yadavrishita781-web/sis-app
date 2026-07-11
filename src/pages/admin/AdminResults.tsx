import { useState } from 'react';
import { useMockDB } from '../../context/MockDB';
import { StatusBadge } from '../../components/StatusBadge';
import { CheckCircle, Lock } from 'lucide-react';
import { cn } from '../../utils';

export function AdminResults() {
  const { state, publishResults } = useMockDB();
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState('3');
  const [justPublished, setJustPublished] = useState(false);

  const relevantSubjects = state.subjects.filter(s => {
    const dept = state.departments.find(d => d.name === department);
    return s.department === (dept?.code || department.slice(0, 2).toUpperCase()) && s.semester === parseInt(semester);
  });

  const handlePublish = () => {
    const subjectIds = relevantSubjects.map(s => s.id);
    publishResults(subjectIds);
    setJustPublished(true);
    setTimeout(() => setJustPublished(false), 2000);
  };

  // Compute stats per subject
  const subjectStats = relevantSubjects.map(sub => {
    const subjectMarks = state.marks.filter(m => m.subjectId === sub.id);
    const published = state.publishedSubjects.includes(sub.id);
    const avgInternal = subjectMarks.length > 0
      ? Math.round(subjectMarks.reduce((s, m) => s + (m.internalMarks || 0), 0) / subjectMarks.length)
      : 0;
    const avgExternal = subjectMarks.length > 0
      ? Math.round(subjectMarks.reduce((s, m) => s + (m.externalMarks || 0), 0) / subjectMarks.length)
      : 0;
    const passCount = subjectMarks.filter(m => (m.internalMarks || 0) + (m.externalMarks || 0) >= 40).length;
    const passRate = subjectMarks.length > 0 ? Math.round((passCount / subjectMarks.length) * 100) : 0;
    return { ...sub, avgInternal, avgExternal, passRate, published };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Result Management</h1>
          <p className="page-subtitle">Publish and lock semester results</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-red-600 hover:text-red-700">
            <Lock className="h-4 w-4" /> Lock Marks
          </button>
          <button className={cn('btn-primary', justPublished && 'bg-emerald-600 hover:bg-emerald-700')} onClick={handlePublish}>
            {justPublished ? <><CheckCircle className="h-4 w-4" /> Published!</> : 'Publish Results'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <select className="input w-auto" value={department} onChange={e => setDepartment(e.target.value)}>
            {state.departments.map(d => <option key={d.id}>{d.name}</option>)}
          </select>
          <select className="input w-auto" value={semester} onChange={e => setSemester(e.target.value)}>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>

        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3 text-center">Avg Internal</th>
                <th className="px-4 py-3 text-center">Avg External</th>
                <th className="px-4 py-3 text-center">Pass %</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {subjectStats.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400">No subjects found for this filter</td></tr>
              ) : subjectStats.map(sub => (
                <tr key={sub.id} className="table-row">
                  <td className="table-cell font-medium">{sub.name}</td>
                  <td className="table-cell text-center">{sub.avgInternal} / 40</td>
                  <td className="table-cell text-center">{sub.avgExternal} / 80</td>
                  <td className="table-cell text-center">
                    <span className={`font-semibold ${sub.passRate >= 80 ? 'text-emerald-600' : sub.passRate >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {sub.passRate}%
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <StatusBadge status={sub.published ? 'Published' : 'Draft'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-student marks view */}
      {state.students.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Student Marks (Sem {semester})</h2>
          <div className="table-wrapper border-0">
            <table className="table-base">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  {relevantSubjects.map(s => <th key={s.id} className="px-4 py-3 text-center">{s.name.split(' ')[0]}</th>)}
                  <th className="px-4 py-3 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {state.students.slice(0, 10).map(stu => {
                  const stuMarks = relevantSubjects.map(sub => {
                    const m = state.marks.find(mk => mk.studentId === stu.id && mk.subjectId === sub.id);
                    return (m?.internalMarks || 0) + (m?.externalMarks || 0);
                  });
                  const total = stuMarks.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={stu.id} className="table-row">
                      <td className="table-cell">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{stu.name}</p>
                        <p className="text-xs text-slate-400">{stu.rollNo}</p>
                      </td>
                      {stuMarks.map((m, i) => (
                        <td key={i} className="table-cell text-center">{m > 0 ? m : '—'}</td>
                      ))}
                      <td className="table-cell text-center font-semibold">{total > 0 ? total : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
