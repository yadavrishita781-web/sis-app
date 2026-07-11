// ─── User / Auth ────────────────────────────────────────────────────────────

export type Role = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

// ─── Student ─────────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  department: string;
  semester: number;
  section: string;
  batch: string;
  dob: string;
  gender: string;
  address: string;
  parentName: string;
  parentPhone: string;
  avatar?: string;
}

// ─── Faculty ──────────────────────────────────────────────────────────────────

export interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  experience: string;
  subjects: string[];
  avatar?: string;
}

// ─── Department ───────────────────────────────────────────────────────────────

export interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  totalStudents: number;
  totalFaculty: number;
}

// ─── Subject ─────────────────────────────────────────────────────────────────

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  department: string;
  semester: number;
  facultyId: string;
  facultyName: string;
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface SubjectAttendance {
  subjectId: string;
  subjectName: string;
  total: number;
  present: number;
  percentage: number;
}

// ─── Assignments ─────────────────────────────────────────────────────────────

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  facultyId?: string;
  facultyName: string;
  dueDate: string;
  maxMarks: number;
  description: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  submittedAt?: string;
  marksObtained?: number;
  feedback?: string;
  fileUrl?: string;
  fileName?: string;
}

// ─── Assignment Submission ────────────────────────────────────────────────────

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  status: 'submitted' | 'graded';
  marksObtained?: number;
  feedback?: string;
}

// ─── Study Material ───────────────────────────────────────────────────────────

export interface StudyMaterial {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  type: 'pdf' | 'ppt' | 'docx' | 'zip' | 'video' | 'link';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  size?: string;
  fileName?: string;
}

// ─── Marks / Results ─────────────────────────────────────────────────────────

export interface MarkEntry {
  studentId: string;
  subjectId: string;
  internalMarks?: number;
  practicalMarks?: number;
  externalMarks?: number;
  published: boolean;
}

export interface SubjectResult {
  subjectId: string;
  subjectName: string;
  internalMarks: number;
  externalMarks: number;
  practicalMarks: number;
  totalMarks: number;
  maxMarks: number;
  grade: string;
  status: 'pass' | 'fail';
}

export interface SemesterResult {
  semester: number;
  sgpa: number;
  cgpa: number;
  subjects: SubjectResult[];
}

// ─── Fees ─────────────────────────────────────────────────────────────────────

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName?: string;
  type: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  receiptNo?: string;
}

// ─── Notice ───────────────────────────────────────────────────────────────────

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'college' | 'department' | 'exam';
  priority: 'high' | 'medium' | 'low';
  publishedAt: string;
  publishedBy: string;
}

// ─── Leave ───────────────────────────────────────────────────────────────────

export interface LeaveApplication {
  id: string;
  applicantId: string;
  applicantName?: string;
  type: 'medical' | 'casual' | 'emergency';
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedBy?: string;
}

// ─── Timetable ───────────────────────────────────────────────────────────────

export interface TimetableSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  facultyName: string;
  room: string;
  department?: string;
  semester?: number;
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export interface Profile {
  userId: string;
  name: string;
  phone: string;
  address?: string;
  avatar?: string;
  password?: string;
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  color: string;
}
