import { useState, useRef } from 'react';
import { useMockDB } from '../../context/MockDB';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { formatDate } from '../../utils';
import { cn } from '../../utils';
import { Upload, ChevronDown, ChevronUp, Download } from 'lucide-react';

export function StudentAssignments() {
  const { state, submitAssignment } = useMockDB();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'pending' | 'submitted' | 'graded'>('pending');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [uploadModal, setUploadModal] = useState<typeof state.assignments[0] | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const studentId = user?.id || 'S001';
  const student = state.students.find(s => s.id === studentId) || state.students[0];

  // Show assignments from context — all pending are visible to student
  const allAssignments = state.assignments;
  // Check if student has submitted for a given assignment
  const getStudentStatus = (a: typeof state.assignments[0]) => {
    const sub = state.submissions.find(s => s.assignmentId === a.id && s.studentId === studentId);
    if (sub?.status === 'graded') return 'graded';
    if (sub) return 'submitted';
    return a.status === 'pending' ? 'pending' : a.status;
  };

  const filtered = allAssignments.filter(a => getStudentStatus(a) === tab);

  const handleUpload = () => {
    if (!selectedFile || !uploadModal || !student) return;
    setUploading(true);
    setTimeout(() => {
      submitAssignment(uploadModal.id, studentId, student.name, student.rollNo, selectedFile);
      setUploading(false);
      setUploadModal(null);
      setSelectedFile(null);
      setTab('submitted');
    }, 800);
  };

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
              {allAssignments.filter(a => getStudentStatus(a) === t).length}
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
        ) : filtered.map(a => {
          const sub = state.submissions.find(s => s.assignmentId === a.id && s.studentId === studentId);
          const status = getStudentStatus(a);
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
                  <p className="text-sm text-slate-500 mt-1">{a.subjectName} · {a.facultyName}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span>Due: {formatDate(a.dueDate)}</span>
                    <span>Max Marks: {a.maxMarks}</span>
                    {sub?.marksObtained !== undefined && (
                      <span className="text-emerald-600 font-semibold">Marks: {sub.marksObtained}/{a.maxMarks}</span>
                    )}
                  </div>
                </div>
                {expanded === a.id ? <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />}
              </div>

              {expanded === a.id && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{a.description}</p>

                  {a.fileName && (
                    <a href={a.fileUrl} download={a.fileName} className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                      <Download className="h-4 w-4" /> {a.fileName} (Assignment file)
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
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{sub.fileName}</span>
                        <span className="text-xs text-slate-400">({sub.fileSize})</span>
                        <a href={sub.fileUrl} download={sub.fileName} className="text-indigo-600 hover:underline text-xs flex items-center gap-1">
                          <Download className="h-3 w-3" /> Download
                        </a>
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
        footer={<><button className="btn-secondary" onClick={() => setUploadModal(null)}>Cancel</button><button className="btn-primary" onClick={handleUpload} disabled={!selectedFile || uploading}>{uploading ? 'Uploading...' : 'Submit Assignment'}</button></>}
      >
        {uploadModal && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm">
              <p className="font-medium">{uploadModal.title}</p>
              <p className="text-slate-500">{uploadModal.subjectName} · Due: {formatDate(uploadModal.dueDate)} · Max: {uploadModal.maxMarks} marks</p>
            </div>
            <div>
              <label className="label">Upload your submission</label>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.zip,.txt"
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
