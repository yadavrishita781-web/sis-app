import { useState } from 'react';
import { assignments } from '../../services/dummyData';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils';
import { Modal } from '../../components/Modal';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';

export function FacultyAssignments() {
  const [modalOpen, setModalOpen] = useState(false);
  const [gradeModal, setGradeModal] = useState<typeof assignments[0] | null>(null);
  const [form, setForm] = useState({ title: '', subject: '', dueDate: '', maxMarks: '', description: '' });
  const [grade, setGrade] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">Create, manage, and grade assignments</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Create Assignment
        </button>
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
              {assignments.map(a => (
                <tr key={a.id} className="table-row">
                  <td className="table-cell font-medium">{a.title}</td>
                  <td className="table-cell">{a.subjectName}</td>
                  <td className="table-cell">{formatDate(a.dueDate)}</td>
                  <td className="table-cell">{a.maxMarks}</td>
                  <td className="table-cell"><StatusBadge status={a.status} /></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      {a.status === 'submitted' && (
                        <button onClick={() => setGradeModal(a)} className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg text-amber-600 transition-colors" title="Grade">
                          <Star className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Assignment"
        footer={<><button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button form="assign-form" type="submit" className="btn-primary">Create</button></>}
      >
        <form id="assign-form" onSubmit={e => { e.preventDefault(); setModalOpen(false); }} className="space-y-4">
          <div><label className="label">Title</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div><label className="label">Subject</label>
            <select className="input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
              <option value="">Select subject</option>
              {['Data Structures', 'Software Engineering'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Due Date</label><input type="date" className="input" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required /></div>
            <div><label className="label">Max Marks</label><input type="number" className="input" value={form.maxMarks} onChange={e => setForm({ ...form, maxMarks: e.target.value })} required /></div>
          </div>
          <div><label className="label">Description</label><textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        </form>
      </Modal>

      {/* Grade modal */}
      <Modal open={!!gradeModal} onClose={() => setGradeModal(null)} title="Grade Submission"
        footer={<><button className="btn-secondary" onClick={() => setGradeModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setGradeModal(null)}>Save Grade</button></>}
      >
        {gradeModal && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="font-semibold text-slate-800 dark:text-slate-200">{gradeModal.title}</p>
              <p className="text-sm text-slate-500">{gradeModal.subjectName} · Max: {gradeModal.maxMarks} marks</p>
            </div>
            <div><label className="label">Marks Obtained</label><input type="number" className="input" max={gradeModal.maxMarks} value={grade} onChange={e => setGrade(e.target.value)} /></div>
            <div><label className="label">Feedback</label><textarea className="input resize-none" rows={3} placeholder="Enter feedback for student..." /></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
