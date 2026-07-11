import { useState, useRef } from 'react';
import { useMockDB } from '../../context/MockDB';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { StudyMaterial } from '../../types';
import { formatDate } from '../../utils';
import { Plus, Pencil, Trash2, FileText, Presentation, Video, Link as LinkIcon, Download, Eye, Archive } from 'lucide-react';

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText, ppt: Presentation, docx: FileText, zip: Archive, video: Video, link: LinkIcon,
};
const typeColors: Record<string, string> = {
  pdf: 'text-red-500', ppt: 'text-orange-500', docx: 'text-blue-500', zip: 'text-purple-500', video: 'text-green-500', link: 'text-indigo-500',
};

const BLANK: Omit<StudyMaterial, 'id'> = {
  title: '', subjectId: '', subjectName: '', type: 'pdf', url: '', uploadedBy: '', uploadedAt: '',
};

export function FacultyMaterials() {
  const { state, addMaterial, updateMaterial, deleteMaterial } = useMockDB();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [modal, setModal] = useState<'add' | 'edit' | 'preview' | null>(null);
  const [selected, setSelected] = useState<StudyMaterial | null>(null);
  const [form, setForm] = useState<Omit<StudyMaterial, 'id'>>(BLANK);
  const [confirmDelete, setConfirmDelete] = useState<StudyMaterial | null>(null);
  const [renameModal, setRenameModal] = useState<StudyMaterial | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const myMaterials = state.materials.filter(m => m.uploadedBy === user?.name || state.materials.length > 0 && true);

  const openAdd = () => {
    const firstSub = state.subjects[0];
    setForm({ ...BLANK, uploadedBy: user?.name || 'Faculty', uploadedAt: new Date().toISOString().split('T')[0], subjectId: firstSub?.id || '', subjectName: firstSub?.name || '' });
    setModal('add');
  };
  const openEdit = (m: StudyMaterial) => { setSelected(m); setForm({ ...m }); setModal('edit'); };

  const handleSubjectChange = (subjectId: string) => {
    const sub = state.subjects.find(s => s.id === subjectId);
    setForm(prev => ({ ...prev, subjectId, subjectName: sub?.name || '' }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const type = ['pdf','ppt','docx','zip','mp4'].includes(ext) ? (ext === 'mp4' ? 'video' : ext) : 'pdf';
    const url = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, fileName: file.name, url, type: type as StudyMaterial['type'], size: (file.size / 1024).toFixed(0) + ' KB' }));
  };

  const handleSave = () => {
    if (modal === 'add') addMaterial(form);
    else if (modal === 'edit' && selected) updateMaterial({ ...form, id: selected.id });
    setModal(null);
  };

  const handleRename = () => {
    if (renameModal) updateMaterial({ ...renameModal, title: newTitle });
    setRenameModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Study Materials</h1>
          <p className="page-subtitle">Upload and manage learning resources ({myMaterials.length} files)</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus className="h-4 w-4" /> Upload Material</button>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Uploaded</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {myMaterials.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">No materials uploaded yet.</td></tr>
              ) : myMaterials.map(m => {
                const Icon = typeIcons[m.type] || FileText;
                const iconColor = typeColors[m.type] || 'text-slate-400';
                return (
                  <tr key={m.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${iconColor} flex-shrink-0`} />
                        <span className="font-medium">{m.title}</span>
                      </div>
                    </td>
                    <td className="table-cell">{m.subjectName}</td>
                    <td className="table-cell uppercase text-xs font-semibold text-slate-500">{m.type}</td>
                    <td className="table-cell">{m.size ?? '–'}</td>
                    <td className="table-cell">{formatDate(m.uploadedAt)}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        {m.url && m.url !== '#' && (
                          <>
                            <button onClick={() => { setSelected(m); setModal('preview'); }} title="Preview" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                              <Eye className="h-4 w-4 text-slate-500" />
                            </button>
                            <a href={m.url} download={m.fileName || m.title} title="Download" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-indigo-600">
                              <Download className="h-4 w-4" />
                            </a>
                          </>
                        )}
                        <button title="Rename" onClick={() => { setRenameModal(m); setNewTitle(m.title); }} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <Pencil className="h-4 w-4 text-slate-500" />
                        </button>
                        <button title="Replace / Edit" onClick={() => openEdit(m)} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-blue-500">
                          <Plus className="h-4 w-4 rotate-45" />
                        </button>
                        <button title="Delete" onClick={() => setConfirmDelete(m)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Upload / Edit Modal */}
      <Modal open={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Upload Study Material' : 'Edit Material'} size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={handleSave}>{modal === 'add' ? 'Upload' : 'Save'}</button></>}
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
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value as StudyMaterial['type']})}>
              {['pdf','ppt','docx','zip','video','link'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
          {form.type === 'link' ? (
            <div><label className="label">URL</label><input type="url" className="input" value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://..." /></div>
          ) : (
            <div>
              <label className="label">File</label>
              <input ref={fileRef} type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.mp4" className="input py-2" onChange={handleFileSelect} />
              {form.fileName && <p className="text-xs text-emerald-600 mt-1">✓ {form.fileName} ({form.size})</p>}
            </div>
          )}
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal open={!!renameModal} onClose={() => setRenameModal(null)} title="Rename Material"
        footer={<><button className="btn-secondary" onClick={() => setRenameModal(null)}>Cancel</button><button className="btn-primary" onClick={handleRename}>Rename</button></>}
      >
        <div><label className="label">New Title</label><input className="input" value={newTitle} onChange={e => setNewTitle(e.target.value)} /></div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={modal === 'preview'} onClose={() => setModal(null)} title={`Preview — ${selected?.title}`} size="lg"
        footer={<><a href={selected?.url} download={selected?.fileName || selected?.title} className="btn-primary flex items-center gap-2"><Download className="h-4 w-4" /> Download</a><button className="btn-secondary" onClick={() => setModal(null)}>Close</button></>}
      >
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-slate-400">Title</p><p className="font-medium">{selected.title}</p></div>
              <div><p className="text-xs text-slate-400">Type</p><p className="font-medium uppercase">{selected.type}</p></div>
              <div><p className="text-xs text-slate-400">Subject</p><p className="font-medium">{selected.subjectName}</p></div>
              <div><p className="text-xs text-slate-400">Size</p><p className="font-medium">{selected.size || '—'}</p></div>
              <div><p className="text-xs text-slate-400">Uploaded By</p><p className="font-medium">{selected.uploadedBy}</p></div>
              <div><p className="text-xs text-slate-400">Date</p><p className="font-medium">{formatDate(selected.uploadedAt)}</p></div>
            </div>
            {selected.type === 'link' ? (
              <a href={selected.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">{selected.url}</a>
            ) : selected.url && selected.url !== '#' ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-center">
                <p className="text-sm text-slate-500">File ready — click Download to save</p>
                <p className="text-xs text-slate-400 mt-1">{selected.fileName}</p>
              </div>
            ) : null}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Material" message={`Delete "${confirmDelete?.title}"?`} confirmLabel="Delete"
        onConfirm={() => { deleteMaterial(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}
