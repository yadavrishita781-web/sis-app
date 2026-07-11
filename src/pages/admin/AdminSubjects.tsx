import { useState, useMemo } from 'react';
import { useMockDB } from '../../context/MockDB';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Subject } from '../../types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const BLANK: Omit<Subject, 'id'> = { name: '', code: '', credits: 3, department: 'CS', semester: 3, facultyId: '', facultyName: '' };

export function AdminSubjects() {
  const { state, addSubject, updateSubject, deleteSubject } = useMockDB();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Subject | null>(null);
  const [form, setForm] = useState<Omit<Subject, 'id'>>(BLANK);
  const [confirmDelete, setConfirmDelete] = useState<Subject | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return state.subjects.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.department.toLowerCase().includes(q));
  }, [state.subjects, search]);

  const openAdd = () => { setForm({ ...BLANK, department: state.departments[0]?.code || 'CS', facultyId: state.faculty[0]?.id || '', facultyName: state.faculty[0]?.name || '' }); setModal('add'); };
  const openEdit = (s: Subject) => { setSelected(s); setForm({ ...s }); setModal('edit'); };

  const handleFacultyChange = (facultyId: string) => {
    const fac = state.faculty.find(f => f.id === facultyId);
    setForm(prev => ({ ...prev, facultyId, facultyName: fac?.name || '' }));
  };

  const handleSave = () => {
    if (modal === 'add') addSubject(form);
    else if (modal === 'edit' && selected) updateSubject({ ...form, id: selected.id });
    setModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subject Management</h1>
          <p className="page-subtitle">Manage subjects and assign faculty ({state.subjects.length} subjects)</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search subjects..." />
          <button className="btn-primary" onClick={openAdd}><Plus className="h-4 w-4" /> Add Subject</button>
        </div>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Department / Sem</th>
                <th className="px-4 py-3">Assigned Faculty</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">No subjects found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell font-medium">{s.name}</td>
                  <td className="table-cell font-mono text-sm">{s.code}</td>
                  <td className="table-cell">{s.credits}</td>
                  <td className="table-cell">{s.department} · Sem {s.semester}</td>
                  <td className="table-cell">{s.facultyName}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><Pencil className="h-4 w-4 text-slate-500" /></button>
                      <button onClick={() => setConfirmDelete(s)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Subject' : 'Edit Subject'} size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={handleSave}>Save</button></>}
      >
        <div className="space-y-4">
          <div><label className="label">Subject Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Subject Code</label><input className="input" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required /></div>
            <div><label className="label">Credits</label><input type="number" min={1} max={6} className="input" value={form.credits} onChange={e => setForm({...form, credits: +e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <select className="input" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                {state.departments.map(d => <option key={d.id} value={d.code}>{d.name}</option>)}
              </select>
            </div>
            <div><label className="label">Semester</label><input type="number" min={1} max={8} className="input" value={form.semester} onChange={e => setForm({...form, semester: +e.target.value})} /></div>
          </div>
          <div>
            <label className="label">Assign Faculty</label>
            <select className="input" value={form.facultyId} onChange={e => handleFacultyChange(e.target.value)}>
              <option value="">Select Faculty...</option>
              {state.faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Subject" message={`Delete "${confirmDelete?.name}"? This cannot be undone.`} confirmLabel="Delete"
        onConfirm={() => { deleteSubject(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}
