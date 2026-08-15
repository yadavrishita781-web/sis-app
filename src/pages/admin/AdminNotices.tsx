import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operationService } from '../../services/operationService';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { StatusBadge } from '../../components/StatusBadge';
import { Notice } from '../../types';
import { formatDate } from '../../utils';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

const BLANK: Omit<Notice, 'id' | 'publishedAt'> = { title: '', content: '', type: 'college', priority: 'medium', publishedBy: 'Administration' };

export function AdminNotices() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [form, setForm] = useState<Omit<Notice, 'id' | 'publishedAt'>>(BLANK);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  const { data: notices = [], isLoading: loadingNotices } = useQuery({
    queryKey: ['notices'],
    queryFn: () => operationService.getNotices()
  });

  const createMutation = useMutation({
    mutationFn: (newNotice: any) => operationService.createNotice(newNotice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setModal(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updatedNotice: any) => {
      const { id, ...data } = updatedNotice;
      return operationService.createNotice({ id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setModal(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => operationService.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    }
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notices.filter((n: any) => 
      (n.title || '').toLowerCase().includes(q) || 
      (n.type || '').toLowerCase().includes(q) || 
      (n.publishedBy || n.published_by || '').toLowerCase().includes(q)
    );
  }, [notices, search]);

  const openAdd = () => { setForm(BLANK); setModal('add'); };
  const openEdit = (n: any) => { 
    setSelected(n); 
    setForm({ 
      title: n.title, 
      content: n.content, 
      type: n.type as any, 
      priority: n.priority as any, 
      publishedBy: n.publishedBy || n.published_by || 'Administration' 
    }); 
    setModal('edit'); 
  };

  const handleSave = () => {
    const payload = {
      title: form.title,
      content: form.content,
      type: form.type,
      priority: form.priority,
      publishedBy: form.publishedBy || 'Administration'
    };

    if (modal === 'add') {
      createMutation.mutate(payload);
    } else if (modal === 'edit' && selected) {
      updateMutation.mutate({ ...payload, id: selected.id });
    }
  };

  if (loadingNotices) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notice Board Management</h1>
          <p className="page-subtitle">Publish and manage college announcements ({notices.length} notices)</p>
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
              ) : filtered.map((n: any) => (
                <tr key={n.id} className="table-row">
                  <td className="table-cell font-medium max-w-sm truncate">{n.title}</td>
                  <td className="table-cell capitalize">{n.type}</td>
                  <td className="table-cell"><StatusBadge status={n.priority} /></td>
                  <td className="table-cell">{n.publishedBy || n.published_by || 'Administration'}</td>
                  <td className="table-cell">{formatDate(n.publishedAt || n.published_at)}</td>
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
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending} onClick={handleSave}>{modal === 'add' ? (createMutation.isPending ? 'Publishing...' : 'Publish') : 'Save Changes'}</button></>}
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
        onConfirm={() => { deleteMutation.mutate(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}
