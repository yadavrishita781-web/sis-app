import { useState } from 'react';
import { assignments } from '../../services/dummyData';
import { SearchBar } from '../../components/SearchBar';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils';
import { Trash2 } from 'lucide-react';

export function AdminAssignments() {
  const [search, setSearch] = useState('');
  const filtered = assignments.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.facultyName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignment Oversight</h1>
          <p className="page-subtitle">View all assignments across departments</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search assignment or faculty..." />
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Subject & Faculty</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(a => (
                <tr key={a.id} className="table-row">
                  <td className="table-cell font-medium max-w-xs truncate">{a.title}</td>
                  <td className="table-cell">
                    <p className="text-slate-800 dark:text-slate-200">{a.subjectName}</p>
                    <p className="text-xs text-slate-500">{a.facultyName}</p>
                  </td>
                  <td className="table-cell">{formatDate(a.dueDate)}</td>
                  <td className="table-cell"><StatusBadge status={a.status} /></td>
                  <td className="table-cell">
                    <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
