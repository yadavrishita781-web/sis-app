import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../../services/assignmentService';
import { academicService } from '../../services/academicService';
import { facultyService } from '../../services/facultyService';
import { SearchBar } from '../../components/SearchBar';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { formatDate } from '../../utils';
import { Trash2, Loader2 } from 'lucide-react';

export function AdminAssignments() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  const { data: assignments = [], isLoading: loadingAssignments } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => assignmentService.getAssignments()
  });

  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => academicService.getSubjects()
  });

  const { data: faculty = [], isLoading: loadingFaculty } = useQuery({
    queryKey: ['adminFaculty'],
    queryFn: () => facultyService.getFaculty()
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assignmentService.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    }
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return assignments.filter((a: any) => {
      const subject = subjects.find((s: any) => s.id === a.subjectId || s.id === a.subject_id);
      const fac = faculty.find((f: any) => f.id === a.facultyId || f.user_id === a.faculty_id);
      return (
        (a.title || '').toLowerCase().includes(q) ||
        (a.subjectName || subject?.name || '').toLowerCase().includes(q) ||
        (a.facultyName || fac?.name || '').toLowerCase().includes(q)
      );
    });
  }, [assignments, subjects, faculty, search]);


  if (loadingAssignments || loadingSubjects || loadingFaculty) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

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
          <p className="text-3xl font-bold text-indigo-600">{assignments.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total Assignments</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-amber-600">{subjects.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total Subjects</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-emerald-600">{faculty.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total Faculty</p>
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
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">No assignments found</td></tr>
              ) : filtered.map((a: any) => {
                const subject = subjects.find((s: any) => s.id === a.subjectId || s.id === a.subject_id);
                const fac = faculty.find((f: any) => f.id === a.facultyId || f.user_id === a.faculty_id);
                const dueDate = a.dueDate || a.due_date;
                const isClosed = dueDate ? new Date(dueDate) < new Date() : false;
                const status = isClosed ? 'closed' : 'active';
                return (
                  <tr key={a.id} className="table-row">
                    <td className="table-cell font-medium max-w-xs truncate">{a.title}</td>
                    <td className="table-cell">
                      <p className="text-slate-800 dark:text-slate-200">{a.subjectName || a.subject_name || subject?.name}</p>
                      <p className="text-xs text-slate-500">{a.facultyName || a.faculty_name || fac?.name}</p>
                    </td>
                    <td className="table-cell">{formatDate(dueDate)}</td>
                    <td className="table-cell">{a.maxMarks || a.max_marks || 100}</td>
                    <td className="table-cell"><StatusBadge status={status} /></td>
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
        onConfirm={() => { deleteMutation.mutate(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}

