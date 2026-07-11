import { useMockDB } from '../../context/MockDB';
import { StudyMaterial } from '../../types';
import { formatDate } from '../../utils';
import { FileText, Presentation, Video, Link as LinkIcon, Archive, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/Modal';

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText, ppt: Presentation, docx: FileText, zip: Archive, video: Video, link: LinkIcon,
};
const typeColors: Record<string, string> = {
  pdf: 'text-red-500 bg-red-100 dark:bg-red-900/20',
  ppt: 'text-orange-500 bg-orange-100 dark:bg-orange-900/20',
  docx: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
  zip: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20',
  video: 'text-green-500 bg-green-100 dark:bg-green-900/20',
  link: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/20',
};

export function StudentMaterials() {
  const { state } = useMockDB();
  const [subject, setSubject] = useState('all');
  const [preview, setPreview] = useState<StudyMaterial | null>(null);

  const filtered = subject === 'all'
    ? state.materials
    : state.materials.filter(m => m.subjectId === subject);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Study Materials</h1>
          <p className="page-subtitle">Access all learning resources shared by your faculty</p>
        </div>
        <select className="input w-auto" value={subject} onChange={e => setSubject(e.target.value)}>
          <option value="all">All Subjects</option>
          {state.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 card text-center py-12">
            <p className="text-slate-400">No materials available for this subject</p>
          </div>
        ) : filtered.map(m => {
          const Icon = typeIcons[m.type] || FileText;
          const colors = typeColors[m.type] || 'text-slate-400 bg-slate-100';
          return (
            <div key={m.id} className="card hover:shadow-md transition-shadow flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${colors}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-tight">{m.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{m.subjectName}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{m.uploadedBy}</span>
                <span>{formatDate(m.uploadedAt)}{m.size ? ` · ${m.size}` : ''}</span>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                {m.type === 'link' ? (
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-1.5 flex-1 justify-center">
                    <LinkIcon className="h-3.5 w-3.5" /> Open Link
                  </a>
                ) : (
                  <>
                    <button onClick={() => setPreview(m)} className="btn-secondary text-xs py-1.5 flex-1 justify-center">
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </button>
                    {m.url && m.url !== '#' && (
                      <a href={m.url} download={m.fileName || m.title} className="btn-primary text-xs py-1.5 flex-1 justify-center">
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.title || 'Preview'} size="lg"
        footer={<>
          {preview?.url && preview.url !== '#' && (
            <a href={preview.url} download={preview.fileName || preview.title} className="btn-primary flex items-center gap-2">
              <Download className="h-4 w-4" /> Download
            </a>
          )}
          <button className="btn-secondary" onClick={() => setPreview(null)}>Close</button>
        </>}
      >
        {preview && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-slate-400">Subject</p><p className="font-medium">{preview.subjectName}</p></div>
              <div><p className="text-xs text-slate-400">Type</p><p className="font-medium uppercase">{preview.type}</p></div>
              <div><p className="text-xs text-slate-400">Uploaded By</p><p className="font-medium">{preview.uploadedBy}</p></div>
              <div><p className="text-xs text-slate-400">Size</p><p className="font-medium">{preview.size || '—'}</p></div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-700 rounded-xl text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400">{preview.fileName || preview.title}</p>
              <p className="text-xs text-slate-400 mt-1">Click Download to open the file</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
