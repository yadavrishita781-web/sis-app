import { useState } from 'react';
import { subjects, departments, facultyList } from '../../services/dummyData';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function AdminSubjects() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = subjects.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subject Management</h1>
          <p className="page-subtitle">Manage subjects and assign faculty</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search subjects..." />
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Subject
          </button>
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
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Assigned Faculty</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell font-medium">{s.name}</td>
                  <td className="table-cell">{s.code}</td>
                  <td className="table-cell">{s.credits}</td>
                  <td className="table-cell">{s.department} (Sem {s.semester})</td>
                  <td className="table-cell">{s.facultyName}</td>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Subject"
        footer={<><button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary">Save</button></>}
      >
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div><label className="label">Subject Name</label><input className="input" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Subject Code</label><input className="input" required /></div>
            <div><label className="label">Credits</label><input type="number" min="1" max="6" className="input" required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <select className="input">
                {departments.map(d => <option key={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div><label className="label">Semester</label><input type="number" min="1" max="8" className="input" required /></div>
          </div>
          <div>
            <label className="label">Assign Faculty</label>
            <select className="input">
              <option value="">Select Faculty...</option>
              {facultyList.map(f => <option key={f.id}>{f.name}</option>)}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
