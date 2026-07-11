import { useState, useMemo } from 'react';
import { useMockDB } from '../../context/MockDB';
import { SearchBar } from '../../components/SearchBar';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { formatDate } from '../../utils';
import { Trash2 } from 'lucide-react';

export function AdminAssignments() {
  const { state, deleteAssignment } = useMockDB();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<typeof state.assignments[0] | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return state.assignments.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.facultyName.toLowerCase().includes(q) ||
      a.subjectName.toLowerCase().includes(q)
    );
  }, [state.assignments, search]);

  const totalSubmissions = state.submissions.length;
  const pendingGrading = state.submissions.filter(s => s.status === 'submitted').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignment Oversight</h1>
          <p className="page-subtitle">View all assignments across departments</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search assignment or faculty..." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-indigo-600">{state.assignments.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total Assignments</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-amber-600">{totalSubmissions}</p>
          <p className="text-sm text-slate-500 mt-1">Total Submissions</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-emerald-600">{pendingGrading}</p>
          <p className="text-sm text-slate-500 mt-1">Pending Grading</p>
        </div>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Subject & Faculty</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Max Marks</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submissions</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400">No assignments found</td></tr>
              ) : filtered.map(a => {
                const submissionCount = state.submissions.filter(s => s.assignmentId === a.id).length;
                return (
                  <tr key={a.id} className="table-row">
                    <td className="table-cell font-medium max-w-xs truncate">{a.title}</td>
                    <td className="table-cell">
                      <p className="text-slate-800 dark:text-slate-200">{a.subjectName}</p>
                      <p className="text-xs text-slate-500">{a.facultyName}</p>
                    </td>
                    <td className="table-cell">{formatDate(a.dueDate)}</td>
                    <td className="table-cell">{a.maxMarks}</td>
                    <td className="table-cell"><StatusBadge status={a.status} /></td>
                    <td className="table-cell">{submissionCount} / {state.students.length}</td>
                    <td className="table-cell">
                      <button onClick={() => setConfirmDelete(a)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog open={!!confirmDelete} title="Delete Assignment" message={`Delete "${confirmDelete?.title}"?`} confirmLabel="Delete"
        onConfirm={() => { deleteAssignment(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}
