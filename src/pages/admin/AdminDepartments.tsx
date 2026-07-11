import { useState } from 'react';
import { departments } from '../../services/dummyData';
import { Modal } from '../../components/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function AdminDepartments() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Department Management</h1>
          <p className="page-subtitle">Manage college departments</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Department
        </button>
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
              {departments.map(d => (
                <tr key={d.id} className="table-row">
                  <td className="table-cell font-medium">{d.name}</td>
                  <td className="table-cell">{d.code}</td>
                  <td className="table-cell">{d.hod}</td>
                  <td className="table-cell text-right">{d.totalStudents}</td>
                  <td className="table-cell text-right">{d.totalFaculty}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><Pencil className="h-4 w-4 text-slate-500" /></button>
                      <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Department"
        footer={<><button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary">Save</button></>}
      >
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div><label className="label">Department Name</label><input className="input" required /></div>
          <div><label className="label">Department Code</label><input className="input" required /></div>
          <div><label className="label">Head of Department (HOD)</label><input className="input" required /></div>
        </form>
      </Modal>
    </div>
  );
}
