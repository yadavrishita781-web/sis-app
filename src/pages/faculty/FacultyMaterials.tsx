import { useState } from 'react';
import { studyMaterials } from '../../services/dummyData';
import { formatDate } from '../../utils';
import { Plus, Pencil, Trash2, FileText, Presentation, Video, Link as LinkIcon } from 'lucide-react';
import { Modal } from '../../components/Modal';

const typeIcons = { pdf: FileText, ppt: Presentation, video: Video, link: LinkIcon };

export function FacultyMaterials() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', type: 'pdf', url: '' });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Study Material</h1>
          <p className="page-subtitle">Upload and manage learning resources</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Upload Material
        </button>
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
              {studyMaterials.map(m => {
                const Icon = typeIcons[m.type];
                return (
                  <tr key={m.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{m.title}</span>
                      </div>
                    </td>
                    <td className="table-cell">{m.subjectName}</td>
                    <td className="table-cell uppercase text-xs font-semibold text-slate-500">{m.type}</td>
                    <td className="table-cell">{m.size ?? '-'}</td>
                    <td className="table-cell">{formatDate(m.uploadedAt)}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Pencil className="h-4 w-4 text-slate-500" /></button>
                        <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="h-4 w-4 text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload Study Material"
        footer={<><button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button form="mat-form" type="submit" className="btn-primary">Upload</button></>}
      >
        <form id="mat-form" onSubmit={e => { e.preventDefault(); setModalOpen(false); }} className="space-y-4">
          <div><label className="label">Title</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div><label className="label">Subject</label>
            <select className="input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
              <option value="">Select subject</option>
              {['Data Structures', 'Software Engineering'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="label">Type</label>
            <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {['pdf', 'ppt', 'video', 'link'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
          {form.type === 'link' ? (
            <div><label className="label">URL</label><input className="input" type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} required /></div>
          ) : (
            <div><label className="label">File</label><input type="file" className="input py-2" /></div>
          )}
        </form>
      </Modal>
    </div>
  );
}
