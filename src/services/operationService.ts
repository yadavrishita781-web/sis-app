import { Notice, FeeRecord, LeaveApplication } from '../types';
import { FirestoreCollection } from './dbHelper';


const INITIAL_NOTICES: Notice[] = [
  { id: 'not-1', title: 'Mid-Term Examination Schedule Announced', content: 'Mid-term examinations for the odd semester will commence from September 15, 2026. Detailed timetable is available on the portal.', type: 'exam', priority: 'high', publishedAt: '2026-08-12', publishedBy: 'Examination Cell' },
  { id: 'not-2', title: 'Annual TechFest "INNOVA 2026" Registrations Open', content: 'Registrations are now live for INNOVA 2026 hackathons, robotics, and coding competitions.', type: 'college', priority: 'medium', publishedAt: '2026-08-10', publishedBy: 'Student Affairs' },
  { id: 'not-3', title: 'CSE Department Workshop on Generative AI', content: 'Hands-on workshop on LLMs and Cloud Architecture scheduled for Saturday, August 22, 2026.', type: 'department', priority: 'medium', publishedAt: '2026-08-08', publishedBy: 'CSE Department' },
];

const INITIAL_FEES: FeeRecord[] = [
  { id: 'fee-1', studentId: 'std-1', studentName: 'Rishita Yadav', type: 'Tuition Fee (Semester 6)', amount: 45000, status: 'paid', dueDate: '2026-08-01', paidDate: '2026-07-28', receiptNo: 'REC-2026-00421' },
  { id: 'fee-2', studentId: 'std-1', studentName: 'Rishita Yadav', type: 'Hostel & Mess Fee', amount: 35000, status: 'paid', dueDate: '2026-08-01', paidDate: '2026-07-28', receiptNo: 'REC-2026-00422' },
  { id: 'fee-3', studentId: 'std-1', studentName: 'Rishita Yadav', type: 'Examination Fee (Odd Sem)', amount: 2500, status: 'pending', dueDate: '2026-09-01' },
];

const INITIAL_RESULTS: any[] = [
  {
    id: 'res-sem-5',
    semester: 5,
    sgpa: 8.92,
    cgpa: 8.78,
    subjects: [
      { subjectId: 'sub-1', subjectName: 'Data Structures & Algorithms', internalMarks: 28, externalMarks: 64, practicalMarks: 0, totalMarks: 92, maxMarks: 100, grade: 'O', status: 'pass' },
      { subjectId: 'sub-2', subjectName: 'Database Management Systems', internalMarks: 26, externalMarks: 60, practicalMarks: 0, totalMarks: 86, maxMarks: 100, grade: 'A+', status: 'pass' },
      { subjectId: 'sub-3', subjectName: 'Computer Networks', internalMarks: 25, externalMarks: 58, practicalMarks: 0, totalMarks: 83, maxMarks: 100, grade: 'A', status: 'pass' },
      { subjectId: 'sub-4', subjectName: 'Operating Systems', internalMarks: 27, externalMarks: 61, practicalMarks: 0, totalMarks: 88, maxMarks: 100, grade: 'A+', status: 'pass' },
    ]
  }
];

const INITIAL_LEAVES: LeaveApplication[] = [
  { id: 'leave-1', applicantId: 'std-1', applicantName: 'Rishita Yadav', type: 'medical', fromDate: '2026-08-20', toDate: '2026-08-22', reason: 'Viral fever and medical rest as advised by physician.', status: 'pending', appliedAt: '2026-08-14' },
];

const noticeStore = new FirestoreCollection<Notice>('notices', INITIAL_NOTICES);
const feeStore = new FirestoreCollection<FeeRecord>('fees', INITIAL_FEES);
const resultStore = new FirestoreCollection<any>('results', INITIAL_RESULTS);
const leaveStore = new FirestoreCollection<LeaveApplication>('leaves', INITIAL_LEAVES);

export const operationService = {
  // ─── Notices ───
  async getNotices(): Promise<Notice[]> {
    return noticeStore.getAll();
  },

  async createNotice(data: Partial<Notice>): Promise<Notice> {
    const id = data.id || `not-${Date.now()}`;
    const notice: Notice = {
      id,
      title: data.title || 'New Notice',
      content: data.content || '',
      type: data.type || 'college',
      priority: data.priority || 'medium',
      publishedAt: new Date().toISOString().split('T')[0],
      publishedBy: data.publishedBy || 'Administration'
    };
    return noticeStore.add(notice);
  },

  async deleteNotice(id: string): Promise<void> {
    return noticeStore.remove(id);
  },

  // ─── Fees ───
  async getFees(studentId?: string): Promise<FeeRecord[]> {
    const all = await feeStore.getAll();
    return studentId ? all.filter(f => f.studentId === studentId) : all;
  },

  async createFee(data: Partial<FeeRecord>): Promise<FeeRecord> {
    const id = data.id || `fee-${Date.now()}`;
    const fee: FeeRecord = {
      id,
      studentId: data.studentId || 'std-1',
      studentName: data.studentName || 'Student Name',
      type: data.type || 'Semester Tuition Fee',
      amount: Number(data.amount) || 5000,
      status: data.status || 'pending',
      dueDate: data.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      paidDate: data.paidDate,
      receiptNo: data.receiptNo
    };
    return feeStore.add(fee);
  },

  async updateFeeStatus(id: string, status: 'paid' | 'pending' | 'overdue'): Promise<void> {
    await feeStore.update(id, {
      status,
      paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
      receiptNo: status === 'paid' ? `REC-${Date.now().toString().slice(-6)}` : undefined
    });
  },


  // ─── Results / Marks ───
  async getResults(studentId?: string): Promise<any[]> {
    const all = await resultStore.getAll();
    return studentId ? all.filter(r => !r.studentId || r.studentId === studentId) : all;
  },

  async saveResult(data: any): Promise<void> {
    const id = data.id || `res-${data.studentId || 'all'}-${data.subjectId || Date.now()}`;
    await resultStore.add({
      id,
      ...data,
      updatedAt: new Date().toISOString()
    });
  },

  // ─── Leave Applications ───
  async getLeaves(applicantId?: string): Promise<LeaveApplication[]> {
    const all = await leaveStore.getAll();
    return applicantId ? all.filter(l => l.applicantId === applicantId || (l as any).userId === applicantId) : all;
  },

  async applyLeave(data: Partial<LeaveApplication>): Promise<LeaveApplication> {
    const id = data.id || `leave-${Date.now()}`;
    const leave: LeaveApplication = {
      id,
      applicantId: data.applicantId || (data as any).userId || 'std-1',
      applicantName: data.applicantName || (data as any).userName || 'Applicant',
      type: data.type || 'casual',
      fromDate: data.fromDate || new Date().toISOString().split('T')[0],
      toDate: data.toDate || new Date().toISOString().split('T')[0],
      reason: data.reason || '',
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0]
    };
    return leaveStore.add(leave);
  },

  async reviewLeave(id: string, status: 'approved' | 'rejected'): Promise<void> {
    await leaveStore.update(id, { status });
  },

  // ─── Settings ───
  async getSettings(): Promise<any> {
    const cached = localStorage.getItem('sis_settings');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    const defaultSettings = {
      collegeName: 'National Institute of Technology & Science',
      collegeCode: 'NITS-2026',
      academicYear: '2025-2026',
      currentSemester: 'Odd Semester (Fall 2026)',
      emailNotifications: true,
      maintenanceMode: false
    };
    localStorage.setItem('sis_settings', JSON.stringify(defaultSettings));
    return defaultSettings;
  },

  async updateSettings(data: any): Promise<void> {
    const current = await this.getSettings();
    const updated = { ...current, ...data };
    localStorage.setItem('sis_settings', JSON.stringify(updated));
  }
};
