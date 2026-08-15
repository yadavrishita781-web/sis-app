import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialService } from '../../services/materialService';
import { academicService } from '../../services/academicService';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { StudyMaterial } from '../../types';
import { formatDate } from '../../utils';
import { Plus, Trash2, FileText, Presentation, Video, Link as LinkIcon, Archive, Loader2, Download } from 'lucide-react';

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
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [modal, setModal] = useState<'add' | 'edit' | 'preview' | null>(null);
  const [form, setForm] = useState<any>(BLANK);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: materials = [], isLoading: loadingMaterials } = useQuery({
    queryKey: ['materials'],
    queryFn: () => materialService.getMaterials()
  });

  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => academicService.getSubjects()
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => materialService.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      setConfirmDelete(null);
    }
  });

  const myMaterials = materials;

  const openAdd = () => {
    const firstSub = subjects[0];
    setForm({ 
      ...BLANK, 
      uploadedBy: user?.name || 'Faculty', 
      uploadedAt: new Date().toISOString().split('T')[0], 
      subjectId: firstSub?.id || '',
      subjectName: firstSub?.name || ''
    });
    setSelectedFile(null);
    setModal('add');
  };

  const handleSubjectChange = (subjectId: string) => {
    const sub = subjects.find((s: any) => s.id === subjectId);
    setForm((prev: any) => ({ ...prev, subjectId, subjectName: sub?.name || '' }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const type = ['pdf','ppt','docx','zip','mp4'].includes(ext) ? (ext === 'mp4' ? 'video' : ext) : 'pdf';
    setForm((prev: any) => ({ 
      ...prev, 
      fileName: file.name, 
      type: type as StudyMaterial['type'], 
      size: (file.size / 1024).toFixed(0) + ' KB' 
    }));
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => materialService.createMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      setModal(null);
    }
  });

  const handleSave = async () => {
    if (modal === 'add') {
      try {
        setUploading(true);
        let fileUrl = '';
        if (selectedFile) {
          fileUrl = await storageService.uploadFile(`materials/${form.subjectId}/${Date.now()}_${selectedFile.name}`, selectedFile);
        }

        await createMutation.mutateAsync({
          title: form.title,
          subjectId: form.subjectId,
          subjectName: form.subjectName || subjects.find((s: any) => s.id === form.subjectId)?.name || '',
          type: form.type || 'pdf',
          fileUrl,
          url: fileUrl,
          fileName: selectedFile?.name || form.fileName || '',
          size: form.size || '1.2 MB',
          uploadedBy: user?.name || 'Faculty Member',
          uploadedAt: new Date().toISOString()
        });
      } catch (err: any) {
        alert(err.message || 'Failed to upload material');
      } finally {
        setUploading(false);
      }
    }
  };

  if (loadingMaterials || loadingSubjects) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

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
              ) : myMaterials.map((m: any) => {
                const Icon = typeIcons[m.type] || FileText;
                const iconColor = typeColors[m.type] || 'text-slate-400';
                const subject = subjects.find((s: any) => s.id === m.subjectId || s.id === m.subject_id);
                const fileUrl = m.fileUrl || m.url;
                return (
                  <tr key={m.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${iconColor} flex-shrink-0`} />
                        <span className="font-medium">{m.title}</span>
                      </div>
                    </td>
                    <td className="table-cell">{m.subjectName || m.subject_name || subject?.name}</td>
                    <td className="table-cell uppercase text-xs font-semibold text-slate-500">{m.type}</td>
                    <td className="table-cell">{m.size ?? '–'}</td>
                    <td className="table-cell">{formatDate(m.uploadedAt || m.uploaded_at)}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        {fileUrl && (
                          <a href={fileUrl} target="_blank" rel="noreferrer" title="Download Material" className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 transition-colors">
                            <Download className="h-4 w-4" />
                          </a>
                        )}
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

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Upload Study Material" size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={handleSave} disabled={createMutation.isPending || uploading}>{uploading ? 'Uploading...' : 'Upload'}</button></>}
      >
        <div className="space-y-4">
          <div><label className="label">Title</label><input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div>
            <label className="label">Subject</label>
            <select className="input" value={form.subjectId} onChange={e => handleSubjectChange(e.target.value)}>
              <option value="">Select subject</option>
              {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">File</label>
            <input ref={fileRef} type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.mp4" className="input py-2" onChange={handleFileSelect} />
            {form.fileName && <p className="text-xs text-emerald-600 mt-1">✓ {form.fileName} ({form.size})</p>}
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Material" message={`Delete "${confirmDelete?.title}"?`} confirmLabel="Delete"
        onConfirm={() => { deleteMutation.mutate(confirmDelete!.id); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}


