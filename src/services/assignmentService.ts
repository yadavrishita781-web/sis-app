import { Assignment, Submission } from '../types';
import { storageService } from './storageService';
import { FirestoreCollection } from './dbHelper';

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'AVL Trees & Red-Black Trees Implementation',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    facultyId: 'fac-1',
    facultyName: 'Prof. Suraj Sharma',
    dueDate: '2026-08-25',
    maxMarks: 100,
    description: 'Implement self-balancing binary search trees (AVL and Red-Black) in C++ with rotation operations and test insertion and deletion benchmarking.',
    status: 'pending',
  },
  {
    id: 'asg-2',
    title: 'Normalization & ER Diagram Project',
    subjectId: 'sub-2',
    subjectName: 'Database Management Systems',
    facultyId: 'fac-2',
    facultyName: 'Dr. Priya Mehta',
    dueDate: '2026-08-30',
    maxMarks: 50,
    description: 'Design a normalized (BCNF) relational schema for a hospital management system and write complex SQL queries with stored procedures.',
    status: 'pending',
  },
  {
    id: 'asg-3',
    title: 'TCP/IP Socket Programming Lab',
    subjectId: 'sub-3',
    subjectName: 'Computer Networks',
    facultyId: 'fac-3',
    facultyName: 'Prof. Rajesh Verma',
    dueDate: '2026-09-05',
    maxMarks: 50,
    description: 'Write a multi-client concurrent chat server using select() or epoll() socket API in Python/C.',
    status: 'pending',
  },
];

const INITIAL_SUBMISSIONS: Submission[] = [];

const assignmentStore = new FirestoreCollection<Assignment>('assignments', INITIAL_ASSIGNMENTS);
const submissionStore = new FirestoreCollection<Submission>('submissions', INITIAL_SUBMISSIONS);

export const assignmentService = {
  async getAssignments(): Promise<Assignment[]> {
    return assignmentStore.getAll();
  },

  async createAssignment(data: Partial<Assignment>, file?: File): Promise<Assignment> {
    const id = data.id || `asg-${Date.now()}`;
    let fileUrl = data.fileUrl;
    let fileName = data.fileName;

    if (file) {
      fileUrl = await storageService.uploadFile(`assignments/${Date.now()}_${file.name}`, file);
      fileName = file.name;
    }

    const assignment: Assignment = {
      id,
      title: data.title || 'New Assignment',
      subjectId: data.subjectId || 'sub-1',
      subjectName: data.subjectName || 'General Subject',
      facultyId: data.facultyId || '',
      facultyName: data.facultyName || 'Faculty',
      dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      maxMarks: Number(data.maxMarks) || 100,
      description: data.description || '',
      status: 'pending',
      fileUrl,
      fileName
    };

    return assignmentStore.add(assignment);
  },

  async updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment> {
    return assignmentStore.update(id, data);
  },

  async deleteAssignment(id: string): Promise<void> {
    return assignmentStore.remove(id);
  },

  // ─── Submissions ───
  async getSubmissions(assignmentId?: string): Promise<Submission[]> {
    const subs = await submissionStore.getAll();
    if (assignmentId) return subs.filter(s => s.assignmentId === assignmentId);
    return subs;
  },

  async getSubmissionsByUser(studentId: string): Promise<Submission[]> {
    const subs = await submissionStore.getAll();
    return subs.filter(s => s.studentId === studentId);
  },

  async submitAssignment(
    arg1: string | { assignmentId: string; studentId: string; studentName?: string; rollNo?: string; fileUrl?: string; fileName?: string },
    arg2?: { id: string; name: string; rollNo: string } | File,
    arg3?: File
  ): Promise<Submission> {
    let assignmentId = '';
    let studentId = '';
    let studentName = 'Student';
    let rollNo = 'ROLL';
    let fileUrl = '';
    let fileName = '';
    let fileSize = '1.0 MB';

    if (typeof arg1 === 'object') {
      assignmentId = arg1.assignmentId;
      studentId = arg1.studentId;
      studentName = arg1.studentName || 'Student';
      rollNo = arg1.rollNo || 'ROLL';
      fileUrl = arg1.fileUrl || '';
      fileName = arg1.fileName || '';
    } else {
      assignmentId = arg1;
      if (arg2 && !(arg2 instanceof File)) {
        studentId = arg2.id;
        studentName = arg2.name;
        rollNo = arg2.rollNo;
      }
      if (arg3 instanceof File) {
        fileUrl = await storageService.uploadFile(`submissions/${studentId}/${Date.now()}_${arg3.name}`, arg3);
        fileName = arg3.name;
        fileSize = (arg3.size / 1024).toFixed(1) + ' KB';
      }
    }

    const subId = `sub-${assignmentId}-${studentId}`;

    const submission: Submission = {
      id: subId,
      assignmentId,
      studentId,
      studentName,
      rollNo,
      submittedAt: new Date().toISOString(),
      fileName,
      fileSize,
      fileUrl,
      status: 'submitted'
    };

    return submissionStore.add(submission);
  },

  async gradeSubmission(submissionId: string, marksObtained: number, feedback: string): Promise<void> {
    await submissionStore.update(submissionId, {
      marksObtained,
      feedback,
      status: 'graded'
    });
  }
};
