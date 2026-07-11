import { useState } from 'react';
import { useMockDB } from '../../context/MockDB';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Department } from '../../types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const BLANK: Omit<Department, 'id'> = { name: '', code: '', hod: '', totalStudents: 0, totalFaculty: 0 };

export function AdminDepartments() {
  const { state, addDepartment, updateDepartment, deleteDepartment } = useMockDB();
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Department | null>(null);
  const [form, setForm] = useState<Omit<Department, 'id'>>(BLANK);
  const [confirmDelete, setConfirmDelete] = useState<Department | null>(null);

  const openAdd = () => { setForm(BLANK); setModal('add'); };
  const openEdit = (d: Department) => { setSelected(d); setForm({ ...d }); setModal('edit'); };
  const handleSave = () => {
    if (modal === 'add') addDepartment(form);
    else if (modal === 'edit' && selected) updateDepartment({ ...form, id: selected.id });
    setModal(null);
  };

  // Live counts from db
  const depts = state.departments.map(d => ({
    ...d,
    liveStudents: state.students.filter(s => s.department === d.name).length,
    liveFaculty: state.faculty.filter(f => f.department === d.name).length,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Department Management</h1>
          <p className="page-subtitle">Manage college departments</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus className="h-4 w-4" /> Add Department</button>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Department Name</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">HOD</th>
                <th className="px-4 py-3 text-right">Students</th>
                <th className="px-4 py-3 text-right">Faculty</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {depts.map(d => (
                <tr key={d.id} className="table-row">
                  <td className="table-cell font-medium">{d.name}</td>
                  <td className="table-cell font-mono text-sm">{d.code}</td>
                  <td className="table-cell">{d.hod}</td>
                  <td className="table-cell text-right">{d.liveStudents}</td>
                  <td className="table-cell text-right">{d.liveFaculty}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(d)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><Pencil className="h-4 w-4 text-slate-500" /></button>
                      <button onClick={() => setConfirmDelete(d)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Department' : 'Edit Department'}
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={handleSave}>Save</button></>}
      >
        <div className="space-y-4">
          <div><label className="label">Department Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div><label className="label">Department Code</label><input className="input" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required /></div>
          <div><label className="label">Head of Department (HOD)</label><input className="input" value={form.hod} onChange={e => setForm({...form, hod: e.target.value})} required /></div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Department" message={`Delete "${confirmDelete?.name}" department? This cannot be undone.`} confirmLabel="Delete"
        onConfirm={() => { deleteDepartment(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}
