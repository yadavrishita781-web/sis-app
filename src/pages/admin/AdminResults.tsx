import { useState } from 'react';
import { semesterResults, departments } from '../../services/dummyData';
import { StatusBadge } from '../../components/StatusBadge';
import { CheckCircle, Lock } from 'lucide-react';
import { cn } from '../../utils';

export function AdminResults() {
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState('3');
  const [published, setPublished] = useState(false);

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => setPublished(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Result Management</h1>
          <p className="page-subtitle">Publish and lock semester results</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-red-600 hover:text-red-700 dark:hover:bg-red-900/20"><Lock className="h-4 w-4" /> Lock Marks</button>
          <button className={cn('btn-primary', published && 'bg-emerald-600 hover:bg-emerald-700')} onClick={handlePublish}>
            {published ? <><CheckCircle className="h-4 w-4" /> Published!</> : 'Publish Results'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <select className="input w-auto" value={department} onChange={e => setDepartment(e.target.value)}>
            {departments.map(d => <option key={d.id}>{d.name}</option>)}
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
              {semesterResults[0].subjects.map(sub => (
                <tr key={sub.subjectId} className="table-row">
                  <td className="table-cell font-medium">{sub.subjectName}</td>
                  <td className="table-cell text-center">34.5 / 40</td>
                  <td className="table-cell text-center">68.2 / 80</td>
                  <td className="table-cell text-center font-semibold text-emerald-600">94.5%</td>
                  <td className="table-cell text-center"><StatusBadge status="Ready" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
