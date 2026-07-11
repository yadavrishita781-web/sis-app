import { useState, useRef } from 'react';
import { useMockDB } from '../../context/MockDB';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { StatusBadge } from '../../components/StatusBadge';
import { Assignment, Submission } from '../../types';
import { formatDate } from '../../utils';
import { Plus, Pencil, Trash2, Star, Eye, Upload, Download } from 'lucide-react';

const BLANK: Omit<Assignment, 'id'> = {
  title: '', subjectId: '', subjectName: '', facultyName: 'Dr. Ramesh Kumar',
  dueDate: '', maxMarks: 20, description: '', status: 'pending',
};

export function FacultyAssignments() {
  const { state, addAssignment, updateAssignment, deleteAssignment, gradeSubmission } = useMockDB();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [modal, setModal] = useState<'add' | 'edit' | 'grade' | 'submissions' | null>(null);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [form, setForm] = useState<Omit<Assignment, 'id'>>(BLANK);
  const [grade, setGrade] = useState({ marks: '', feedback: '' });
  const [confirmDelete, setConfirmDelete] = useState<Assignment | null>(null);

  const myAssignments = state.assignments.filter(a => a.facultyName === (user?.name || 'Dr. Ramesh Kumar'));

  const openAdd = () => {
    const firstSub = state.subjects[0];
    setForm({ ...BLANK, facultyName: user?.name || 'Dr. Ramesh Kumar', subjectId: firstSub?.id || '', subjectName: firstSub?.name || '' });
    setModal('add');
  };
  const openEdit = (a: Assignment) => { setSelected(a); setForm({ ...a }); setModal('edit'); };
  const openGrade = (a: Assignment) => { setSelected(a); setGrade({ marks: '', feedback: '' }); setModal('grade'); };
  const openSubmissions = (a: Assignment) => { setSelected(a); setModal('submissions'); };

  const handleSubjectChange = (subjectId: string) => {
    const sub = state.subjects.find(s => s.id === subjectId);
    setForm(prev => ({ ...prev, subjectId, subjectName: sub?.name || '' }));
  };

  const handleSave = () => {
    if (modal === 'add') addAssignment(form);
    else if (modal === 'edit' && selected) updateAssignment({ ...form, id: selected.id });
    setModal(null);
  };

  const handleGrade = () => {
    if (!selectedSub) return;
    gradeSubmission(selectedSub.id, +grade.marks, grade.feedback);
    setModal(null);
  };

  const submissions = (a: Assignment | null) => state.submissions.filter(s => s.assignmentId === a?.id);

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
                <th className="px-4 py-3">Submissions</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {myAssignments.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400">No assignments yet. Create one!</td></tr>
              ) : myAssignments.map(a => {
                const subs = submissions(a);
                return (
                  <tr key={a.id} className="table-row">
                    <td className="table-cell font-medium">{a.title}</td>
                    <td className="table-cell">{a.subjectName}</td>
                    <td className="table-cell">{formatDate(a.dueDate)}</td>
                    <td className="table-cell">{a.maxMarks}</td>
                    <td className="table-cell"><StatusBadge status={a.status} /></td>
                    <td className="table-cell">
                      <button onClick={() => openSubmissions(a)} className="text-indigo-600 hover:underline text-sm font-medium">
                        {subs.length} {subs.length === 1 ? 'submission' : 'submissions'}
                      </button>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        {subs.some(s => s.status === 'submitted') && (
                          <button onClick={() => { openGrade(a); setSelectedSub(subs.find(s => s.status === 'submitted') || null); }} className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg text-amber-600 transition-colors" title="Grade">
                            <Star className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => openSubmissions(a)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title="View Submissions">
                          <Eye className="h-4 w-4 text-slate-500" />
                        </button>
                        <button onClick={() => openEdit(a)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <Pencil className="h-4 w-4 text-slate-500" />
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

      {/* Create/Edit Modal */}
      <Modal open={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Create Assignment' : 'Edit Assignment'} size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={handleSave}>{modal === 'add' ? 'Create' : 'Save'}</button></>}
      >
        <div className="space-y-4">
          <div><label className="label">Title</label><input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div>
            <label className="label">Subject</label>
            <select className="input" value={form.subjectId} onChange={e => handleSubjectChange(e.target.value)}>
              <option value="">Select subject</option>
              {state.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Due Date</label><input type="date" className="input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
            <div><label className="label">Max Marks</label><input type="number" className="input" value={form.maxMarks} onChange={e => setForm({...form, maxMarks: +e.target.value})} /></div>
          </div>
          <div><label className="label">Description</label><textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div>
            <label className="label">Assignment File (Optional)</label>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.zip" className="input py-2" onChange={e => {
              const file = e.target.files?.[0];
              if (file) setForm(prev => ({ ...prev, fileName: file.name, fileUrl: URL.createObjectURL(file) }));
            }} />
          </div>
        </div>
      </Modal>

      {/* Submissions Modal */}
      <Modal open={modal === 'submissions'} onClose={() => setModal(null)} title={`Submissions — ${selected?.title}`} size="lg"
        footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}
      >
        {selected && (
          <div className="space-y-3">
            {submissions(selected).length === 0 ? (
              <p className="text-slate-400 text-center py-8">No submissions yet</p>
            ) : submissions(selected).map(sub => (
              <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{sub.studentName}</p>
                  <p className="text-xs text-slate-500">{sub.rollNo} · {sub.fileName} ({sub.fileSize})</p>
                  <p className="text-xs text-slate-400">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                  {sub.marksObtained !== undefined && (
                    <p className="text-xs text-emerald-600 font-semibold mt-1">Marks: {sub.marksObtained}/{selected.maxMarks} — {sub.feedback}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={sub.status} />
                  <a href={sub.fileUrl} download={sub.fileName} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-indigo-600">
                    <Download className="h-4 w-4" />
                  </a>
                  {sub.status === 'submitted' && (
                    <button onClick={() => { setSelectedSub(sub); setModal('grade'); }} className="p-1.5 hover:bg-amber-50 rounded-lg text-amber-600">
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Grade Modal */}
      <Modal open={modal === 'grade'} onClose={() => setModal(null)} title="Grade Submission"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={handleGrade}>Save Grade</button></>}
      >
        {selectedSub && selected && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedSub.studentName} ({selectedSub.rollNo})</p>
              <p className="text-sm text-slate-500">{selected.subjectName} · {selectedSub.fileName}</p>
              <a href={selectedSub.fileUrl} download={selectedSub.fileName} className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-1">
                <Download className="h-3 w-3" /> Download & preview
              </a>
            </div>
            <div><label className="label">Marks Obtained (Max: {selected.maxMarks})</label><input type="number" className="input" max={selected.maxMarks} value={grade.marks} onChange={e => setGrade({...grade, marks: e.target.value})} /></div>
            <div><label className="label">Feedback</label><textarea className="input resize-none" rows={3} value={grade.feedback} onChange={e => setGrade({...grade, feedback: e.target.value})} placeholder="Enter feedback for student..." /></div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Assignment" message={`Delete "${confirmDelete?.title}"?`} confirmLabel="Delete"
        onConfirm={() => { deleteAssignment(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}
