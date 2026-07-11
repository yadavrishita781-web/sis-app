import { useState, useMemo } from 'react';
import { useMockDB } from '../../context/MockDB';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { StatusBadge } from '../../components/StatusBadge';
import { Notice } from '../../types';
import { formatDate } from '../../utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const BLANK: Omit<Notice, 'id' | 'publishedAt'> = { title: '', content: '', type: 'college', priority: 'medium', publishedBy: 'Administration' };

export function AdminNotices() {
  const { state, addNotice, updateNotice, deleteNotice } = useMockDB();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Notice | null>(null);
  const [form, setForm] = useState<Omit<Notice, 'id' | 'publishedAt'>>(BLANK);
  const [confirmDelete, setConfirmDelete] = useState<Notice | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return state.notices.filter(n => n.title.toLowerCase().includes(q) || n.type.toLowerCase().includes(q) || n.publishedBy.toLowerCase().includes(q));
  }, [state.notices, search]);

  const openAdd = () => { setForm(BLANK); setModal('add'); };
  const openEdit = (n: Notice) => { setSelected(n); setForm({ title: n.title, content: n.content, type: n.type, priority: n.priority, publishedBy: n.publishedBy }); setModal('edit'); };

  const handleSave = () => {
    if (modal === 'add') addNotice(form);
    else if (modal === 'edit' && selected) updateNotice({ ...form, id: selected.id, publishedAt: selected.publishedAt });
    setModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notice Board Management</h1>
          <p className="page-subtitle">Publish and manage college announcements ({state.notices.length} notices)</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search notices..." />
          <button className="btn-primary" onClick={openAdd}><Plus className="h-4 w-4" /> New Notice</button>
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
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">No notices found</td></tr>
              ) : filtered.map(n => (
                <tr key={n.id} className="table-row">
                  <td className="table-cell font-medium max-w-sm truncate">{n.title}</td>
                  <td className="table-cell capitalize">{n.type}</td>
                  <td className="table-cell"><StatusBadge status={n.priority} /></td>
                  <td className="table-cell">{n.publishedBy}</td>
                  <td className="table-cell">{formatDate(n.publishedAt)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(n)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><Pencil className="h-4 w-4 text-slate-500" /></button>
                      <button onClick={() => setConfirmDelete(n)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Create Notice' : 'Edit Notice'} size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={handleSave}>{modal === 'add' ? 'Publish' : 'Save Changes'}</button></>}
      >
        <div className="space-y-4">
          <div><label className="label">Notice Title</label><input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value as Notice['type']})}>
                <option value="college">College</option>
                <option value="department">Department</option>
                <option value="exam">Exam</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={e => setForm({...form, priority: e.target.value as Notice['priority']})}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div><label className="label">Published By</label><input className="input" value={form.publishedBy} onChange={e => setForm({...form, publishedBy: e.target.value})} /></div>
          <div><label className="label">Content</label><textarea className="input resize-none" rows={5} value={form.content} onChange={e => setForm({...form, content: e.target.value})} required /></div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Notice" message={`Delete notice "${confirmDelete?.title}"?`} confirmLabel="Delete"
        onConfirm={() => { deleteNotice(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}
