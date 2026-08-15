import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../../services/assignmentService';
import { academicService } from '../../services/academicService';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils';
import { Plus, Trash2, Star, Eye, Loader2, Download } from 'lucide-react';

const BLANK = {
  title: '', subjectId: '',
  dueDate: '', maxMarks: 20, description: '', status: 'active',
};

export function FacultyAssignments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [modal, setModal] = useState<'add' | 'edit' | 'grade' | 'submissions' | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [form, setForm] = useState<any>(BLANK);
  const [grade, setGrade] = useState({ marks: '', feedback: '' });
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: assignments = [], isLoading: loadingAssignments } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => assignmentService.getAssignments()
  });

  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => academicService.getSubjects()
  });

  const createMutation = useMutation({
    mutationFn: async (assignmentData: any) => {
      return assignmentService.createAssignment(assignmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setModal(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assignmentService.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setConfirmDelete(null);
    }
  });

  const gradeMutation = useMutation({
    mutationFn: async ({ submissionId, marks, feedback }: any) => {
      return assignmentService.gradeSubmission(submissionId, marks, feedback);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', selected?.id] });
      setModal(null);
    }
  });

  const { data: currentSubmissions = [] } = useQuery({
    queryKey: ['submissions', selected?.id],
    queryFn: () => selected?.id ? assignmentService.getSubmissions(selected.id) : [],
    enabled: !!selected?.id
  });

  const openAdd = () => {
    const mySubjects = subjects.filter((s: any) => s.facultyId === user?.id || s.faculty_id === user?.id);
    const firstSub = mySubjects[0] || subjects[0];
    setForm({ 
      ...BLANK, 
      subjectId: firstSub?.id || '',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16)
    });
    setModal('add');
  };

  const openGrade = (sub: any) => { 
    setSelectedSub(sub); 
    setGrade({ 
      marks: sub.marks !== undefined && sub.marks !== null ? String(sub.marks) : sub.marks_obtained ? String(sub.marks_obtained) : '', 
      feedback: sub.feedback || '' 
    }); 
    setModal('grade'); 
  };

  const openSubmissions = (a: any) => { setSelected(a); setModal('submissions'); };

  const handleSave = async () => {
    if (modal === 'add') {
      try {
        setUploading(true);
        let fileUrl = '';
        let fileName = '';

        if (fileRef.current?.files?.[0]) {
          const file = fileRef.current.files[0];
          fileName = file.name;
          fileUrl = await storageService.uploadFile(`assignments/${Date.now()}_${file.name}`, file);
        }

        const sub = subjects.find((s: any) => s.id === form.subjectId);

        await createMutation.mutateAsync({
          title: form.title,
          subjectId: form.subjectId,
          subjectName: sub?.name || '',
          facultyId: user?.id || '',
          facultyName: user?.name || 'Faculty Member',
          dueDate: form.dueDate,
          maxMarks: Number(form.maxMarks),
          description: form.description || '',
          status: 'active',
          fileUrl,
          fileName
        });
      } catch (err: any) {
        alert(err.message || 'Failed to create assignment');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleGradeSubmit = () => {
    if (selectedSub) {
      gradeMutation.mutate({
        submissionId: selectedSub.id,
        marks: parseFloat(grade.marks),
        feedback: grade.feedback
      });
    }
  };

  if (loadingAssignments || loadingSubjects) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">Create, manage, and grade assignments</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus className="h-4 w-4" /> Create Assignment</button>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Max Marks</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {assignments.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">No assignments yet. Create one!</td></tr>
              ) : assignments.map((a: any) => {
                const subject = subjects.find((s: any) => s.id === a.subjectId || s.id === a.subject_id);
                const dueDate = a.dueDate || a.due_date;
                const isClosed = dueDate ? new Date(dueDate) < new Date() : false;
                const status = isClosed ? 'closed' : 'active';
                return (
                  <tr key={a.id} className="table-row">
                    <td className="table-cell font-medium">{a.title}</td>
                    <td className="table-cell">{a.subjectName || a.subject_name || subject?.name}</td>
                    <td className="table-cell">{formatDate(dueDate)}</td>
                    <td className="table-cell">{a.maxMarks || a.max_marks || 20}</td>
                    <td className="table-cell"><StatusBadge status={status} /></td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openSubmissions(a)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title="View Submissions">
                          <Eye className="h-4 w-4 text-slate-500" />
                        </button>
                        <button onClick={() => setConfirmDelete(a)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
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

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Create Assignment" size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" disabled={createMutation.isPending || uploading} onClick={handleSave}>{uploading ? 'Uploading...' : 'Create'}</button></>}
      >
        <div className="space-y-4">
          <div><label className="label">Title</label><input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div>
            <label className="label">Subject</label>
            <select className="input" value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
              <option value="">Select subject</option>
              {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Due Date</label><input type="datetime-local" className="input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
            <div><label className="label">Max Marks</label><input type="number" className="input" value={form.maxMarks} onChange={e => setForm({...form, maxMarks: +e.target.value})} /></div>
          </div>
          <div><label className="label">Description</label><textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div>
            <label className="label">Assignment File (Optional)</label>
            <input type="file" ref={fileRef} className="input py-2" />
          </div>
        </div>
      </Modal>

      {/* Submissions Modal */}
      <Modal open={modal === 'submissions'} onClose={() => setModal(null)} title={`Submissions — ${selected?.title}`} size="lg"
        footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}
      >
        {selected && (
          <div className="space-y-3">
            {currentSubmissions.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No student submissions yet</p>
            ) : currentSubmissions.map((sub: any) => (
              <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{sub.studentName || sub.student_name || sub.studentId || sub.student_id}</p>
                  <p className="text-xs text-slate-400">File: {sub.fileName || sub.file_name} · Submitted: {formatDate(sub.submittedAt || sub.submitted_at)}</p>
                  {sub.fileUrl && (
                    <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5">
                      <Download className="h-3 w-3" /> View Submitted File
                    </a>
                  )}
                  {(sub.marks !== undefined || sub.marks_obtained !== undefined) && <p className="text-xs font-semibold text-emerald-600 mt-0.5">Marks: {sub.marks ?? sub.marks_obtained}/{selected.maxMarks || selected.max_marks || 20}</p>}
                </div>
                <button onClick={() => openGrade(sub)} className="btn-secondary text-xs py-1 px-3 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500" /> {sub.status === 'graded' ? 'Regrade' : 'Grade'}
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Grade Modal */}
      <Modal open={modal === 'grade'} onClose={() => setModal(null)} title="Grade Submission" size="md"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" disabled={gradeMutation.isPending} onClick={handleGradeSubmit}>Submit Grade</button></>}
      >
        <div className="space-y-4">
          <div><label className="label">Marks Obtained (Max: {selected?.maxMarks || selected?.max_marks || 20})</label><input type="number" className="input" value={grade.marks} onChange={e => setGrade({...grade, marks: e.target.value})} required /></div>
          <div><label className="label">Feedback</label><textarea className="input resize-none" rows={3} value={grade.feedback} onChange={e => setGrade({...grade, feedback: e.target.value})} placeholder="Provide comments..." /></div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Assignment" message={`Delete "${confirmDelete?.title}"?`} confirmLabel="Delete"
        onConfirm={() => { deleteMutation.mutate(confirmDelete!.id); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}


