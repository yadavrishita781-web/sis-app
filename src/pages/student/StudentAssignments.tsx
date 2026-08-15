import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../../services/assignmentService';
import { academicService } from '../../services/academicService';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { formatDate, cn } from '../../utils';
import { Upload, ChevronDown, ChevronUp, Download, Loader2 } from 'lucide-react';

export function StudentAssignments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'pending' | 'submitted' | 'graded'>('pending');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [uploadModal, setUploadModal] = useState<any | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => assignmentService.getAssignments()
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => academicService.getSubjects()
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['studentSubmissions', user?.id],
    queryFn: () => user?.id ? assignmentService.getSubmissionsByUser(user.id) : []
  });

  const submitMutation = useMutation({
    mutationFn: async ({ assignmentId, file }: { assignmentId: string, file: File }) => {
      const fileUrl = await storageService.uploadFile(`submissions/${user?.id}/${Date.now()}_${file.name}`, file);
      return assignmentService.submitAssignment({
        assignmentId,
        studentId: user?.id || '',
        studentName: user?.name || user?.email || 'Student',
        fileUrl,
        fileName: file.name
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentSubmissions', user?.id] });
      setUploadModal(null);
      setSelectedFile(null);
    }
  });

  const getStudentStatus = (a: any) => {
    const sub = submissions.find((s: any) => s.assignmentId === a.id || s.assignment_id === a.id);
    if (sub?.status === 'graded') return 'graded';
    if (sub) return 'submitted';
    return 'pending';
  };

  const filtered = assignments.filter((a: any) => getStudentStatus(a) === tab);

  const handleSubmit = async () => {
    if (!uploadModal) return;
    if (!selectedFile) {
      alert("Please select a file to submit.");
      return;
    }
    try {
      setUploading(true);
      await submitMutation.mutateAsync({ assignmentId: uploadModal.id, file: selectedFile });
    } catch (err: any) {
      alert(err.message || "Failed to submit assignment");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
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
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">Manage your assignments and submissions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        {(['pending', 'submitted', 'graded'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-md text-sm font-medium capitalize transition-all',
              tab === t
                ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            {t}
            <span className={cn('ml-2 text-xs px-1.5 py-0.5 rounded-full',
              tab === t ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
            )}>
              {assignments.filter((a: any) => getStudentStatus(a) === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Assignment cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-400">No {tab} assignments</p>
          </div>
        ) : filtered.map((a: any) => {
          const sub = submissions.find((s: any) => s.assignmentId === a.id || s.assignment_id === a.id);
          const status = getStudentStatus(a);
          const subject = subjects.find((s: any) => s.id === a.subjectId || s.id === a.subject_id);
          const dueDate = a.dueDate || a.due_date;
          return (
            <div key={a.id} className="card">
              <div
                className="flex items-start justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{a.title}</h3>
                    <StatusBadge status={status} />
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{a.subjectName || subject?.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span>Due: {formatDate(dueDate)}</span>
                    <span>Max Marks: {a.maxMarks || a.max_marks || 20}</span>
                    {(sub?.marksObtained !== undefined || (sub as any)?.marks !== undefined) && (
                      <span className="text-emerald-600 font-semibold">Marks: {sub?.marksObtained ?? (sub as any)?.marks}/{a.maxMarks || (a as any).max_marks || 20}</span>
                    )}
                  </div>
                </div>
                {expanded === a.id ? <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />}
              </div>

              {expanded === a.id && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{a.description}</p>

                  {(a.fileUrl || (a as any).file_url) && (
                    <a href={a.fileUrl || (a as any).file_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                      <Download className="h-4 w-4" /> Download Assignment attachment
                    </a>
                  )}

                  {sub?.feedback && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Faculty Feedback</p>
                      <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1">{sub.feedback}</p>
                    </div>
                  )}

                  {sub && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-xs text-slate-400">Your submission</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{sub.fileName || (sub as any).file_name}</span>
                        {(sub.fileUrl || (sub as any).file_url) && (
                          <a href={sub.fileUrl || (sub as any).file_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-xs flex items-center gap-1">
                            <Download className="h-3 w-3" /> View Submitted File
                          </a>
                        )}
                      </div>
                    </div>
                  )}


                  {status === 'pending' && (
                    <button className="btn-primary" onClick={() => setUploadModal(a)}>
                      <Upload className="h-4 w-4" /> Upload Submission
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      <Modal open={!!uploadModal} onClose={() => { setUploadModal(null); setSelectedFile(null); }} title={`Submit — ${uploadModal?.title}`}
        footer={<><button className="btn-secondary" onClick={() => setUploadModal(null)}>Cancel</button><button className="btn-primary" onClick={handleSubmit} disabled={submitMutation.isPending || uploading}>{uploading ? 'Uploading...' : 'Confirm Submit'}</button></>}
      >
        {uploadModal && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm">
              <p className="font-medium">{uploadModal.title}</p>
              <p className="text-slate-500">{uploadModal.subjectName || subjects.find((s: any) => s.id === uploadModal.subjectId || s.id === uploadModal.subject_id)?.name} · Due: {formatDate(uploadModal.dueDate || uploadModal.due_date)} · Max: {uploadModal.maxMarks || uploadModal.max_marks || 20} marks</p>
            </div>
            <div>
              <label className="label">Upload your submission</label>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.zip,.txt,.png,.jpg"
                className="input py-2"
                onChange={e => setSelectedFile(e.target.files?.[0] || null)}
              />
              {selectedFile && <p className="text-xs text-emerald-600 mt-1">✓ {selectedFile.name} ({(selectedFile.size/1024).toFixed(1)} KB)</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

