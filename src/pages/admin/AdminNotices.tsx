import { useState } from 'react';
import { notices } from '../../services/dummyData';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function AdminNotices() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const filtered = notices.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notice Board Management</h1>
          <p className="page-subtitle">Publish and manage college announcements</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search notices..." />
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> New Notice
          </button>
        </div>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Published By</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(n => (
                <tr key={n.id} className="table-row">
                  <td className="table-cell font-medium max-w-sm truncate">{n.title}</td>
                  <td className="table-cell capitalize">{n.type}</td>
                  <td className="table-cell"><StatusBadge status={n.priority} /></td>
                  <td className="table-cell">{n.publishedBy}</td>
                  <td className="table-cell">{formatDate(n.publishedAt)}</td>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Notice" size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary">Publish</button></>}
      >
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div><label className="label">Notice Title</label><input className="input" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Type</label>
              <select className="input"><option>College</option><option>Department</option><option>Exam</option></select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input"><option>High</option><option>Medium</option><option>Low</option></select>
            </div>
          </div>
          <div><label className="label">Content</label><textarea className="input resize-none" rows={5} required /></div>
        </form>
      </Modal>
    </div>
  );
}
