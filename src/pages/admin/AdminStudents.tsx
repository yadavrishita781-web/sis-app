import { useState } from 'react';
import { students } from '../../services/dummyData';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';

export function AdminStudents() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Management</h1>
          <p className="page-subtitle">View, add, edit, or remove students</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search students..." />
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Student
          </button>
        </div>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Sem / Sec</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold">{s.name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-mono">{s.rollNo}</td>
                  <td className="table-cell">{s.department}</td>
                  <td className="table-cell">Sem {s.semester} / {s.section}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><Eye className="h-4 w-4 text-slate-500" /></button>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Student" size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary">Save Student</button></>}
      >
        <form className="grid grid-cols-2 gap-4" onSubmit={e => e.preventDefault()}>
          <div><label className="label">Full Name</label><input className="input" required /></div>
          <div><label className="label">Email Address</label><input type="email" className="input" required /></div>
          <div><label className="label">Roll Number</label><input className="input" required /></div>
          <div>
            <label className="label">Department</label>
            <select className="input"><option>Computer Science</option><option>Electronics</option></select>
          </div>
          <div><label className="label">Semester</label><input type="number" min="1" max="8" className="input" required /></div>
          <div><label className="label">Section</label><input className="input" required /></div>
        </form>
      </Modal>
    </div>
  );
}
