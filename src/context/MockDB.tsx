import { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  Student, Faculty, Department, Subject,
  AttendanceRecord, SubjectAttendance, Assignment, Submission,
  StudyMaterial, MarkEntry, SemesterResult, FeeRecord, Notice,
  LeaveApplication, TimetableSlot, Profile,
} from '../types';
import {
  students as seedStudents,
  facultyList as seedFaculty,
  departments as seedDepartments,
  subjects as seedSubjects,
  attendanceHistory as seedAttendanceHistory,
  subjectAttendance as seedSubjectAttendance,
  assignments as seedAssignments,
  studyMaterials as seedMaterials,
  semesterResults as seedResults,
  fees as seedFees,
  notices as seedNotices,
  leaves as seedLeaves,
  timetable as seedTimetable,
  DUMMY_USERS,
  DUMMY_CREDENTIALS,
} from '../services/dummyData';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 10).toUpperCase();
const now = () => new Date().toISOString().split('T')[0];

function computeSubjectAttendance(records: AttendanceRecord[]): SubjectAttendance[] {
  const map: Record<string, { subjectId: string; subjectName: string; total: number; present: number }> = {};
  records.forEach(r => {
    if (!map[r.subjectId]) map[r.subjectId] = { subjectId: r.subjectId, subjectName: r.subjectName, total: 0, present: 0 };
    map[r.subjectId].total++;
    if (r.status === 'present' || r.status === 'late') map[r.subjectId].present++;
  });
  return Object.values(map).map(m => ({ ...m, percentage: m.total === 0 ? 0 : Math.round((m.present / m.total) * 100) }));
}

// ─── Initial marks from seeded results ───────────────────────────────────────

const seedMarks: MarkEntry[] = [];
seedResults.forEach(sr => {
  sr.subjects.forEach(sub => {
    seedMarks.push({
      studentId: 'S001',
      subjectId: sub.subjectId,
      internalMarks: sub.internalMarks,
      externalMarks: sub.externalMarks,
      practicalMarks: sub.practicalMarks,
      published: sr.sgpa > 0,
    });
  });
});

// ─── State ───────────────────────────────────────────────────────────────────

interface DBState {
  users: import('../types').User[];
  credentials: Record<string, string>;
  students: Student[];
  faculty: Faculty[];
  departments: Department[];
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  subjectAttendance: SubjectAttendance[];
  assignments: Assignment[];
  submissions: Submission[];
  materials: StudyMaterial[];
  marks: MarkEntry[];
  fees: FeeRecord[];
  notices: Notice[];
  leaves: LeaveApplication[];
  timetable: TimetableSlot[];
  profiles: Profile[];
  publishedSubjects: string[]; // subjectIds whose results are published
}

const defaultState: DBState = {
  users: DUMMY_USERS,
  credentials: DUMMY_CREDENTIALS,
  students: seedStudents.map(s => ({ ...s, studentName: s.name })),
  faculty: seedFaculty,
  departments: seedDepartments,
  subjects: seedSubjects,
  attendanceRecords: seedAttendanceHistory,
  subjectAttendance: seedSubjectAttendance,
  assignments: seedAssignments,
  submissions: [],
  materials: seedMaterials,
  marks: seedMarks,
  fees: seedFees.map(f => {
    const student = seedStudents.find(s => s.id === f.studentId);
    return { ...f, studentName: student?.name };
  }),
  notices: seedNotices,
  leaves: seedLeaves,
  timetable: seedTimetable.map(t => ({ ...t, department: 'Computer Science', semester: 3 })),
  profiles: [],
  publishedSubjects: ['S2-01', 'S2-02', 'S2-03'],
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'CHANGE_PASSWORD'; payload: { email: string; newPass: string } }
  // Students
  | { type: 'ADD_STUDENT'; payload: { student: Student; password?: string } }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'DELETE_STUDENT'; payload: string }
  // Faculty
  | { type: 'ADD_FACULTY'; payload: { faculty: Faculty; password?: string } }
  | { type: 'UPDATE_FACULTY'; payload: Faculty }
  | { type: 'DELETE_FACULTY'; payload: string }
  // Departments
  | { type: 'ADD_DEPARTMENT'; payload: Department }
  | { type: 'UPDATE_DEPARTMENT'; payload: Department }
  | { type: 'DELETE_DEPARTMENT'; payload: string }
  // Subjects
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'DELETE_SUBJECT'; payload: string }
  // Attendance
  | { type: 'MARK_ATTENDANCE'; payload: { records: AttendanceRecord[] } }
  | { type: 'UPDATE_ATTENDANCE_RECORD'; payload: AttendanceRecord }
  // Assignments
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'DELETE_ASSIGNMENT'; payload: string }
  // Submissions
  | { type: 'SUBMIT_ASSIGNMENT'; payload: Submission }
  | { type: 'GRADE_SUBMISSION'; payload: { submissionId: string; marks: number; feedback: string } }
  // Materials
  | { type: 'ADD_MATERIAL'; payload: StudyMaterial }
  | { type: 'UPDATE_MATERIAL'; payload: StudyMaterial }
  | { type: 'DELETE_MATERIAL'; payload: string }
  // Marks
  | { type: 'SAVE_MARKS'; payload: MarkEntry[] }
  | { type: 'PUBLISH_RESULTS'; payload: string[] } // subjectIds
  // Fees
  | { type: 'ADD_FEE'; payload: FeeRecord }
  | { type: 'UPDATE_FEE'; payload: FeeRecord }
  | { type: 'DELETE_FEE'; payload: string }
  | { type: 'MARK_FEE_STATUS'; payload: { id: string; status: 'paid' | 'pending' | 'overdue'; paidDate?: string; receiptNo?: string } }
  // Notices
  | { type: 'ADD_NOTICE'; payload: Notice }
  | { type: 'UPDATE_NOTICE'; payload: Notice }
  | { type: 'DELETE_NOTICE'; payload: string }
  // Leaves
  | { type: 'ADD_LEAVE'; payload: LeaveApplication }
  | { type: 'UPDATE_LEAVE_STATUS'; payload: { id: string; status: 'approved' | 'rejected'; reviewedBy: string } }
  | { type: 'DELETE_LEAVE'; payload: string }
  // Timetable
  | { type: 'ADD_TIMETABLE_SLOT'; payload: TimetableSlot }
  | { type: 'DELETE_TIMETABLE_SLOT'; payload: string }
  | { type: 'UPDATE_TIMETABLE_SLOT'; payload: TimetableSlot }
  // Profiles
  | { type: 'UPDATE_PROFILE'; payload: Profile };

function reducer(state: DBState, action: Action): DBState {
  switch (action.type) {
    case 'CHANGE_PASSWORD':
      return { ...state, credentials: { ...state.credentials, [action.payload.email]: action.payload.newPass } };

    // ── Students ──
    case 'ADD_STUDENT': {
      const { student, password } = action.payload;
      const newUser: import('../types').User = { id: student.id, name: student.name, email: student.email, role: 'student', avatar: student.avatar };
      return { 
        ...state, 
        students: [...state.students, student],
        users: [...state.users, newUser],
        credentials: password ? { ...state.credentials, [student.email]: password } : state.credentials
      };
    }
    case 'UPDATE_STUDENT': {
      const st = action.payload;
      return { 
        ...state, 
        students: state.students.map(s => s.id === st.id ? st : s),
        users: state.users.map(u => u.id === st.id ? { ...u, name: st.name, email: st.email, avatar: st.avatar } : u)
      };
    }
    case 'DELETE_STUDENT':
      return { 
        ...state, 
        students: state.students.filter(s => s.id !== action.payload),
        users: state.users.filter(u => u.id !== action.payload)
      };

    // ── Faculty ──
    case 'ADD_FACULTY': {
      const { faculty, password } = action.payload;
      const newUser: import('../types').User = { id: faculty.id, name: faculty.name, email: faculty.email, role: 'faculty', avatar: faculty.avatar };
      return { 
        ...state, 
        faculty: [...state.faculty, faculty],
        users: [...state.users, newUser],
        credentials: password ? { ...state.credentials, [faculty.email]: password } : state.credentials
      };
    }
    case 'UPDATE_FACULTY': {
      const f = action.payload;
      return { 
        ...state, 
        faculty: state.faculty.map(fac => fac.id === f.id ? f : fac),
        users: state.users.map(u => u.id === f.id ? { ...u, name: f.name, email: f.email, avatar: f.avatar } : u)
      };
    }
    case 'DELETE_FACULTY':
      return { 
        ...state, 
        faculty: state.faculty.filter(f => f.id !== action.payload),
        users: state.users.filter(u => u.id !== action.payload)
      };

    // ── Departments ──
    case 'ADD_DEPARTMENT':
      return { ...state, departments: [...state.departments, action.payload] };
    case 'UPDATE_DEPARTMENT':
      return { ...state, departments: state.departments.map(d => d.id === action.payload.id ? action.payload : d) };
    case 'DELETE_DEPARTMENT':
      return { ...state, departments: state.departments.filter(d => d.id !== action.payload) };

    // ── Subjects ──
    case 'ADD_SUBJECT':
      return { ...state, subjects: [...state.subjects, action.payload] };
    case 'UPDATE_SUBJECT':
      return { ...state, subjects: state.subjects.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SUBJECT':
      return { ...state, subjects: state.subjects.filter(s => s.id !== action.payload) };

    // ── Attendance ──
    case 'MARK_ATTENDANCE': {
      const newRecords = [...state.attendanceRecords, ...action.payload.records];
      const studentId = action.payload.records[0]?.studentId;
      // Recompute per-student attendance from all records
      const studentRecords = newRecords.filter(r => r.studentId === studentId || !studentId);
      // Actually we need per-student per-subject aggregation for each student
      const allStudentIds = [...new Set(newRecords.map(r => r.studentId))];
      
      // Build combined attendance summary (for the logged-in student S001)
      const s001Records = newRecords.filter(r => r.studentId === 'S001');
      const newSubjectAttendance = s001Records.length > 0 
        ? computeSubjectAttendance(s001Records)
        : state.subjectAttendance;
      
      return {
        ...state,
        attendanceRecords: newRecords,
        subjectAttendance: newSubjectAttendance,
      };
    }
    case 'UPDATE_ATTENDANCE_RECORD':
      return { ...state, attendanceRecords: state.attendanceRecords.map(r => r.id === action.payload.id ? action.payload : r) };

    // ── Assignments ──
    case 'ADD_ASSIGNMENT':
      return { ...state, assignments: [...state.assignments, action.payload] };
    case 'UPDATE_ASSIGNMENT':
      return { ...state, assignments: state.assignments.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'DELETE_ASSIGNMENT':
      return { ...state, assignments: state.assignments.filter(a => a.id !== action.payload) };

    // ── Submissions ──
    case 'SUBMIT_ASSIGNMENT': {
      const sub = action.payload;
      // Update assignment status to 'submitted'
      const updatedAssignments = state.assignments.map(a =>
        a.id === sub.assignmentId ? { ...a, status: 'submitted' as const, submittedAt: sub.submittedAt } : a
      );
      return { ...state, assignments: updatedAssignments, submissions: [...state.submissions, sub] };
    }
    case 'GRADE_SUBMISSION': {
      const { submissionId, marks, feedback } = action.payload;
      const sub = state.submissions.find(s => s.id === submissionId);
      if (!sub) return state;
      const updatedSubs = state.submissions.map(s =>
        s.id === submissionId ? { ...s, status: 'graded' as const, marksObtained: marks, feedback } : s
      );
      const updatedAssignments = state.assignments.map(a =>
        a.id === sub.assignmentId ? { ...a, status: 'graded' as const, marksObtained: marks, feedback } : a
      );
      return { ...state, submissions: updatedSubs, assignments: updatedAssignments };
    }

    // ── Materials ──
    case 'ADD_MATERIAL':
      return { ...state, materials: [...state.materials, action.payload] };
    case 'UPDATE_MATERIAL':
      return { ...state, materials: state.materials.map(m => m.id === action.payload.id ? action.payload : m) };
    case 'DELETE_MATERIAL':
      return { ...state, materials: state.materials.filter(m => m.id !== action.payload) };

    // ── Marks ──
    case 'SAVE_MARKS': {
      const incoming = action.payload;
      const existing = state.marks.filter(m =>
        !incoming.some(i => i.studentId === m.studentId && i.subjectId === m.subjectId)
      );
      return { ...state, marks: [...existing, ...incoming] };
    }
    case 'PUBLISH_RESULTS':
      return { ...state, publishedSubjects: [...new Set([...state.publishedSubjects, ...action.payload])] };

    // ── Fees ──
    case 'ADD_FEE':
      return { ...state, fees: [...state.fees, action.payload] };
    case 'UPDATE_FEE':
      return { ...state, fees: state.fees.map(f => f.id === action.payload.id ? action.payload : f) };
    case 'DELETE_FEE':
      return { ...state, fees: state.fees.filter(f => f.id !== action.payload) };
    case 'MARK_FEE_STATUS':
      return {
        ...state,
        fees: state.fees.map(f =>
          f.id === action.payload.id
            ? { ...f, status: action.payload.status, paidDate: action.payload.paidDate, receiptNo: action.payload.receiptNo }
            : f
        ),
      };

    // ── Notices ──
    case 'ADD_NOTICE':
      return { ...state, notices: [action.payload, ...state.notices] };
    case 'UPDATE_NOTICE':
      return { ...state, notices: state.notices.map(n => n.id === action.payload.id ? action.payload : n) };
    case 'DELETE_NOTICE':
      return { ...state, notices: state.notices.filter(n => n.id !== action.payload) };

    // ── Leaves ──
    case 'ADD_LEAVE':
      return { ...state, leaves: [action.payload, ...state.leaves] };
    case 'UPDATE_LEAVE_STATUS':
      return {
        ...state,
        leaves: state.leaves.map(l =>
          l.id === action.payload.id ? { ...l, status: action.payload.status, reviewedBy: action.payload.reviewedBy } : l
        ),
      };
    case 'DELETE_LEAVE':
      return { ...state, leaves: state.leaves.filter(l => l.id !== action.payload) };

    // ── Timetable ──
    case 'ADD_TIMETABLE_SLOT':
      return { ...state, timetable: [...state.timetable, action.payload] };
    case 'DELETE_TIMETABLE_SLOT':
      return { ...state, timetable: state.timetable.filter(t => t.id !== action.payload) };
    case 'UPDATE_TIMETABLE_SLOT':
      return { ...state, timetable: state.timetable.map(t => t.id === action.payload.id ? action.payload : t) };

    // ── Profiles ──
    case 'UPDATE_PROFILE': {
      const existing = state.profiles.filter(p => p.userId !== action.payload.userId);
      return { ...state, profiles: [...existing, action.payload] };
    }

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface DBContextType {
  state: DBState;
  changePassword: (email: string, newPass: string) => void;
  // Students
  addStudent: (s: Omit<Student, 'id'>, customId?: string, password?: string) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;
  // Faculty
  addFaculty: (f: Omit<Faculty, 'id'>, customId?: string, password?: string) => void;
  updateFaculty: (f: Faculty) => void;
  deleteFaculty: (id: string) => void;
  // Departments
  addDepartment: (d: Omit<Department, 'id'>) => void;
  updateDepartment: (d: Department) => void;
  deleteDepartment: (id: string) => void;
  // Subjects
  addSubject: (s: Omit<Subject, 'id'>) => void;
  updateSubject: (s: Subject) => void;
  deleteSubject: (id: string) => void;
  // Attendance
  markAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  updateAttendanceRecord: (r: AttendanceRecord) => void;
  // Assignments
  addAssignment: (a: Omit<Assignment, 'id'>) => void;
  updateAssignment: (a: Assignment) => void;
  deleteAssignment: (id: string) => void;
  // Submissions
  submitAssignment: (assignmentId: string, studentId: string, studentName: string, rollNo: string, file: File) => void;
  gradeSubmission: (submissionId: string, marks: number, feedback: string) => void;
  // Materials
  addMaterial: (m: Omit<StudyMaterial, 'id'>) => void;
  updateMaterial: (m: StudyMaterial) => void;
  deleteMaterial: (id: string) => void;
  // Marks
  saveMarks: (entries: MarkEntry[]) => void;
  publishResults: (subjectIds: string[]) => void;
  // Fees
  addFee: (f: Omit<FeeRecord, 'id'>) => void;
  updateFee: (f: FeeRecord) => void;
  deleteFee: (id: string) => void;
  markFeeStatus: (id: string, status: 'paid' | 'pending' | 'overdue') => void;
  // Notices
  addNotice: (n: Omit<Notice, 'id'>) => void;
  updateNotice: (n: Notice) => void;
  deleteNotice: (id: string) => void;
  // Leaves
  addLeave: (l: Omit<LeaveApplication, 'id'>) => void;
  updateLeaveStatus: (id: string, status: 'approved' | 'rejected', reviewedBy: string) => void;
  deleteLeave: (id: string) => void;
  // Timetable
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  deleteTimetableSlot: (id: string) => void;
  updateTimetableSlot: (slot: TimetableSlot) => void;
  // Profile
  updateProfile: (p: Profile) => void;
  getProfile: (userId: string, fallback: Partial<Profile>) => Profile;
}

const DBContext = createContext<DBContextType | null>(null);

export function MockDBProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState, (initial) => {
    try {
      const cached = localStorage.getItem('sis_db');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return initial;
  });

  import('react').then(R => {
    R.useEffect(() => {
      localStorage.setItem('sis_db', JSON.stringify(state));
    }, [state]);
  });

  const actions: Omit<DBContextType, 'state'> = {
    changePassword: (email, newPass) => dispatch({ type: 'CHANGE_PASSWORD', payload: { email, newPass } }),
    addStudent: (s, customId, password) => dispatch({ type: 'ADD_STUDENT', payload: { student: { ...s, id: customId || ('S' + uid()) }, password } }),
    updateStudent: (s) => dispatch({ type: 'UPDATE_STUDENT', payload: s }),
    deleteStudent: (id) => dispatch({ type: 'DELETE_STUDENT', payload: id }),

    addFaculty: (f, customId, password) => dispatch({ type: 'ADD_FACULTY', payload: { faculty: { ...f, id: customId || ('F' + uid()) }, password } }),
    updateFaculty: (f) => dispatch({ type: 'UPDATE_FACULTY', payload: f }),
    deleteFaculty: (id) => dispatch({ type: 'DELETE_FACULTY', payload: id }),

    addDepartment: (d) => dispatch({ type: 'ADD_DEPARTMENT', payload: { ...d, id: 'D' + uid() } }),
    updateDepartment: (d) => dispatch({ type: 'UPDATE_DEPARTMENT', payload: d }),
    deleteDepartment: (id) => dispatch({ type: 'DELETE_DEPARTMENT', payload: id }),

    addSubject: (s) => dispatch({ type: 'ADD_SUBJECT', payload: { ...s, id: 'SUB' + uid() } }),
    updateSubject: (s) => dispatch({ type: 'UPDATE_SUBJECT', payload: s }),
    deleteSubject: (id) => dispatch({ type: 'DELETE_SUBJECT', payload: id }),

    markAttendance: (records) => dispatch({
      type: 'MARK_ATTENDANCE',
      payload: { records: records.map(r => ({ ...r, id: 'ATT' + uid() })) },
    }),
    updateAttendanceRecord: (r) => dispatch({ type: 'UPDATE_ATTENDANCE_RECORD', payload: r }),

    addAssignment: (a) => dispatch({ type: 'ADD_ASSIGNMENT', payload: { ...a, id: 'ASN' + uid() } }),
    updateAssignment: (a) => dispatch({ type: 'UPDATE_ASSIGNMENT', payload: a }),
    deleteAssignment: (id) => dispatch({ type: 'DELETE_ASSIGNMENT', payload: id }),

    submitAssignment: (assignmentId, studentId, studentName, rollNo, file) => {
      const fileUrl = URL.createObjectURL(file);
      const sub: Submission = {
        id: 'SUB' + uid(),
        assignmentId,
        studentId,
        studentName,
        rollNo,
        submittedAt: new Date().toISOString(),
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        fileUrl,
        status: 'submitted',
      };
      dispatch({ type: 'SUBMIT_ASSIGNMENT', payload: sub });
    },

    gradeSubmission: (submissionId, marks, feedback) =>
      dispatch({ type: 'GRADE_SUBMISSION', payload: { submissionId, marks, feedback } }),

    addMaterial: (m) => dispatch({ type: 'ADD_MATERIAL', payload: { ...m, id: 'SM' + uid() } }),
    updateMaterial: (m) => dispatch({ type: 'UPDATE_MATERIAL', payload: m }),
    deleteMaterial: (id) => dispatch({ type: 'DELETE_MATERIAL', payload: id }),

    saveMarks: (entries) => dispatch({ type: 'SAVE_MARKS', payload: entries }),
    publishResults: (subjectIds) => dispatch({ type: 'PUBLISH_RESULTS', payload: subjectIds }),

    addFee: (f) => dispatch({ type: 'ADD_FEE', payload: { ...f, id: 'FEE' + uid() } }),
    updateFee: (f) => dispatch({ type: 'UPDATE_FEE', payload: f }),
    deleteFee: (id) => dispatch({ type: 'DELETE_FEE', payload: id }),
    markFeeStatus: (id, status) => {
      const paidDate = status === 'paid' ? now() : undefined;
      const receiptNo = status === 'paid' ? 'REC-' + uid().toUpperCase() : undefined;
      dispatch({ type: 'MARK_FEE_STATUS', payload: { id, status, paidDate, receiptNo } });
    },

    addNotice: (n) => dispatch({ type: 'ADD_NOTICE', payload: { ...n, id: 'N' + uid(), publishedAt: now() } }),
    updateNotice: (n) => dispatch({ type: 'UPDATE_NOTICE', payload: n }),
    deleteNotice: (id) => dispatch({ type: 'DELETE_NOTICE', payload: id }),

    addLeave: (l) => dispatch({ type: 'ADD_LEAVE', payload: { ...l, id: 'L' + uid(), appliedAt: now(), status: 'pending' } }),
    updateLeaveStatus: (id, status, reviewedBy) =>
      dispatch({ type: 'UPDATE_LEAVE_STATUS', payload: { id, status, reviewedBy } }),
    deleteLeave: (id) => dispatch({ type: 'DELETE_LEAVE', payload: id }),

    addTimetableSlot: (slot) => dispatch({ type: 'ADD_TIMETABLE_SLOT', payload: { ...slot, id: 'T' + uid() } }),
    deleteTimetableSlot: (id) => dispatch({ type: 'DELETE_TIMETABLE_SLOT', payload: id }),
    updateTimetableSlot: (slot) => dispatch({ type: 'UPDATE_TIMETABLE_SLOT', payload: slot }),

    updateProfile: (p) => dispatch({ type: 'UPDATE_PROFILE', payload: p }),
    getProfile: (userId, fallback) => {
      const stored = state.profiles.find(p => p.userId === userId);
      return stored ?? { userId, name: fallback.name ?? '', phone: fallback.phone ?? '', address: fallback.address, avatar: fallback.avatar };
    },
  };

  return <DBContext.Provider value={{ state, ...actions }}>{children}</DBContext.Provider>;
}

export function useMockDB() {
  const ctx = useContext(DBContext);
  if (!ctx) throw new Error('useMockDB must be used inside MockDBProvider');
  return ctx;
}
