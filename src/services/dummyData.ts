import {
  Student, Faculty, Department, Subject,
  AttendanceRecord, SubjectAttendance, Assignment,
  StudyMaterial, SemesterResult, FeeRecord, Notice,
  LeaveApplication, TimetableSlot, User,
} from '../types';

// ─── Users (for dummy login) ──────────────────────────────────────────────────

export const DUMMY_USERS: User[] = [
  { id: 'S001', name: 'Rishita', email: 'rishita@sis.edu', role: 'student' },
  { id: 'F001', name: 'Suraj', email: 'suraj@sis.edu', role: 'faculty' },
  { id: 'A001', name: 'Mukesh', email: 'mukesh@sis.edu', role: 'admin' },
];

export const DUMMY_CREDENTIALS: Record<string, string> = {
  'rishita@sis.edu': 'student123',
  'suraj@sis.edu': 'faculty123',
  'mukesh@sis.edu': 'admin123',
};

// ─── Departments ──────────────────────────────────────────────────────────────

export const departments: Department[] = [
  { id: 'D01', name: 'Computer Science', code: 'CS', hod: 'Dr. Mehta', totalStudents: 240, totalFaculty: 18 },
  { id: 'D02', name: 'Electronics', code: 'EC', hod: 'Dr. Patel', totalStudents: 180, totalFaculty: 14 },
  { id: 'D03', name: 'Mechanical', code: 'ME', hod: 'Dr. Verma', totalStudents: 200, totalFaculty: 16 },
  { id: 'D04', name: 'Civil', code: 'CE', hod: 'Dr. Joshi', totalStudents: 150, totalFaculty: 12 },
];

// ─── Subjects ─────────────────────────────────────────────────────────────────

export const subjects: Subject[] = [
  { id: 'SUB01', name: 'Data Structures', code: 'CS301', credits: 4, department: 'CS', semester: 3, facultyId: 'F001', facultyName: 'Dr. Ramesh Kumar' },
  { id: 'SUB02', name: 'Database Management', code: 'CS302', credits: 4, department: 'CS', semester: 3, facultyId: 'F002', facultyName: 'Prof. Anita Nair' },
  { id: 'SUB03', name: 'Operating Systems', code: 'CS303', credits: 3, department: 'CS', semester: 3, facultyId: 'F003', facultyName: 'Dr. Suresh Iyer' },
  { id: 'SUB04', name: 'Computer Networks', code: 'CS304', credits: 3, department: 'CS', semester: 3, facultyId: 'F004', facultyName: 'Prof. Kavita Rao' },
  { id: 'SUB05', name: 'Software Engineering', code: 'CS305', credits: 3, department: 'CS', semester: 3, facultyId: 'F001', facultyName: 'Dr. Ramesh Kumar' },
];

// ─── Students ─────────────────────────────────────────────────────────────────

export const students: Student[] = [
  { id: 'S001', name: 'Rishita', rollNo: 'CS21001', email: 'rishita@sis.edu', phone: '9876543210', department: 'Computer Science', semester: 3, section: 'A', batch: '2021-25', dob: '2003-05-14', gender: 'Female', address: '12 MG Road, Pune', parentName: 'Rakesh Sharma', parentPhone: '9876543200' },
  { id: 'S002', name: 'Arjun Mehta', rollNo: 'CS21002', email: 'arjun@sis.edu', phone: '9876543211', department: 'Computer Science', semester: 3, section: 'A', batch: '2021-25', dob: '2003-08-22', gender: 'Male', address: '45 FC Road, Pune', parentName: 'Suresh Mehta', parentPhone: '9876543201' },
  { id: 'S003', name: 'Sneha Patil', rollNo: 'CS21003', email: 'sneha@sis.edu', phone: '9876543212', department: 'Computer Science', semester: 3, section: 'B', batch: '2021-25', dob: '2003-01-30', gender: 'Female', address: '7 Baner Road, Pune', parentName: 'Mohan Patil', parentPhone: '9876543202' },
  { id: 'S004', name: 'Rohan Gupta', rollNo: 'CS21004', email: 'rohan@sis.edu', phone: '9876543213', department: 'Computer Science', semester: 3, section: 'B', batch: '2021-25', dob: '2003-11-05', gender: 'Male', address: '3 Kothrud, Pune', parentName: 'Vikram Gupta', parentPhone: '9876543203' },
  { id: 'S005', name: 'Kavya Singh', rollNo: 'CS21005', email: 'kavya@sis.edu', phone: '9876543214', department: 'Computer Science', semester: 3, section: 'A', batch: '2021-25', dob: '2003-07-18', gender: 'Female', address: '22 Aundh, Pune', parentName: 'Ajay Singh', parentPhone: '9876543204' },
  { id: 'S006', name: 'Amit Joshi', rollNo: 'EC21001', email: 'amit@sis.edu', phone: '9876543215', department: 'Electronics', semester: 3, section: 'A', batch: '2021-25', dob: '2003-03-25', gender: 'Male', address: '15 Wakad, Pune', parentName: 'Vijay Joshi', parentPhone: '9876543205' },
];

// ─── Faculty ──────────────────────────────────────────────────────────────────

export const facultyList: Faculty[] = [
  { id: 'F001', name: 'Suraj', email: 'suraj@sis.edu', phone: '9876000001', department: 'Computer Science', designation: 'Professor', experience: '15 years', subjects: ['Data Structures', 'Software Engineering'] },
  { id: 'F002', name: 'Prof. Anita Nair', email: 'anita@sis.edu', phone: '9876000002', department: 'Computer Science', designation: 'Associate Professor', experience: '10 years', subjects: ['Database Management'] },
  { id: 'F003', name: 'Dr. Suresh Iyer', email: 'suresh@sis.edu', phone: '9876000003', department: 'Computer Science', designation: 'Assistant Professor', experience: '7 years', subjects: ['Operating Systems'] },
  { id: 'F004', name: 'Prof. Kavita Rao', email: 'kavita@sis.edu', phone: '9876000004', department: 'Electronics', designation: 'Associate Professor', experience: '12 years', subjects: ['Computer Networks'] },
];

// ─── Attendance ───────────────────────────────────────────────────────────────

export const subjectAttendance: SubjectAttendance[] = [
  { subjectId: 'SUB01', subjectName: 'Data Structures', total: 40, present: 36, percentage: 90 },
  { subjectId: 'SUB02', subjectName: 'Database Management', total: 38, present: 30, percentage: 79 },
  { subjectId: 'SUB03', subjectName: 'Operating Systems', total: 35, present: 25, percentage: 71 },
  { subjectId: 'SUB04', subjectName: 'Computer Networks', total: 36, present: 33, percentage: 92 },
  { subjectId: 'SUB05', subjectName: 'Software Engineering', total: 30, present: 28, percentage: 93 },
];

export const attendanceHistory: AttendanceRecord[] = [
  { id: 'A1', studentId: 'S001', subjectId: 'SUB01', subjectName: 'Data Structures', date: '2024-01-15', status: 'present' },
  { id: 'A2', studentId: 'S001', subjectId: 'SUB02', subjectName: 'Database Management', date: '2024-01-15', status: 'present' },
  { id: 'A3', studentId: 'S001', subjectId: 'SUB03', subjectName: 'Operating Systems', date: '2024-01-16', status: 'absent' },
  { id: 'A4', studentId: 'S001', subjectId: 'SUB04', subjectName: 'Computer Networks', date: '2024-01-16', status: 'present' },
  { id: 'A5', studentId: 'S001', subjectId: 'SUB01', subjectName: 'Data Structures', date: '2024-01-17', status: 'present' },
  { id: 'A6', studentId: 'S001', subjectId: 'SUB03', subjectName: 'Operating Systems', date: '2024-01-18', status: 'late' },
];

// ─── Assignments ─────────────────────────────────────────────────────────────

export const assignments: Assignment[] = [
  { id: 'ASN01', title: 'Binary Tree Implementation', subjectId: 'SUB01', subjectName: 'Data Structures', facultyName: 'Dr. Ramesh Kumar', dueDate: '2024-02-10', maxMarks: 20, description: 'Implement a binary search tree with insert, delete, and search operations.', status: 'pending' },
  { id: 'ASN02', title: 'ER Diagram Design', subjectId: 'SUB02', subjectName: 'Database Management', facultyName: 'Prof. Anita Nair', dueDate: '2024-02-05', maxMarks: 15, description: 'Design an ER diagram for a hospital management system.', status: 'submitted', submittedAt: '2024-02-04' },
  { id: 'ASN03', title: 'Process Scheduling Simulation', subjectId: 'SUB03', subjectName: 'Operating Systems', facultyName: 'Dr. Suresh Iyer', dueDate: '2024-01-28', maxMarks: 25, description: 'Simulate FCFS, SJF and Round Robin scheduling algorithms.', status: 'graded', submittedAt: '2024-01-27', marksObtained: 22, feedback: 'Excellent implementation!' },
  { id: 'ASN04', title: 'Socket Programming', subjectId: 'SUB04', subjectName: 'Computer Networks', facultyName: 'Prof. Kavita Rao', dueDate: '2024-02-15', maxMarks: 20, description: 'Write a TCP client-server program using socket API.', status: 'pending' },
];

// ─── Study Material ───────────────────────────────────────────────────────────

export const studyMaterials: StudyMaterial[] = [
  { id: 'SM01', title: 'Data Structures Notes Unit 1', subjectId: 'SUB01', subjectName: 'Data Structures', type: 'pdf', url: '#', uploadedBy: 'Dr. Ramesh Kumar', uploadedAt: '2024-01-10', size: '2.4 MB' },
  { id: 'SM02', title: 'Binary Trees Lecture Slides', subjectId: 'SUB01', subjectName: 'Data Structures', type: 'ppt', url: '#', uploadedBy: 'Dr. Ramesh Kumar', uploadedAt: '2024-01-12', size: '5.1 MB' },
  { id: 'SM03', title: 'SQL Tutorial Video', subjectId: 'SUB02', subjectName: 'Database Management', type: 'video', url: '#', uploadedBy: 'Prof. Anita Nair', uploadedAt: '2024-01-08' },
  { id: 'SM04', title: 'OS Reference Book', subjectId: 'SUB03', subjectName: 'Operating Systems', type: 'link', url: 'https://example.com/os-book', uploadedBy: 'Dr. Suresh Iyer', uploadedAt: '2024-01-05' },
  { id: 'SM05', title: 'DBMS Complete Notes', subjectId: 'SUB02', subjectName: 'Database Management', type: 'pdf', url: '#', uploadedBy: 'Prof. Anita Nair', uploadedAt: '2024-01-15', size: '3.8 MB' },
];

// ─── Results ─────────────────────────────────────────────────────────────────

export const semesterResults: SemesterResult[] = [
  {
    semester: 2,
    sgpa: 8.4,
    cgpa: 8.4,
    subjects: [
      { subjectId: 'S2-01', subjectName: 'Mathematics II', internalMarks: 38, externalMarks: 72, practicalMarks: 0, totalMarks: 110, maxMarks: 150, grade: 'A', status: 'pass' },
      { subjectId: 'S2-02', subjectName: 'Physics', internalMarks: 35, externalMarks: 68, practicalMarks: 24, totalMarks: 127, maxMarks: 175, grade: 'B+', status: 'pass' },
      { subjectId: 'S2-03', subjectName: 'Programming in C', internalMarks: 40, externalMarks: 78, practicalMarks: 28, totalMarks: 146, maxMarks: 175, grade: 'O', status: 'pass' },
    ],
  },
  {
    semester: 3,
    sgpa: 0,
    cgpa: 0,
    subjects: [
      { subjectId: 'SUB01', subjectName: 'Data Structures', internalMarks: 36, externalMarks: 0, practicalMarks: 0, totalMarks: 36, maxMarks: 150, grade: '-', status: 'pass' },
      { subjectId: 'SUB02', subjectName: 'Database Management', internalMarks: 32, externalMarks: 0, practicalMarks: 0, totalMarks: 32, maxMarks: 150, grade: '-', status: 'pass' },
    ],
  },
];

// ─── Fees ─────────────────────────────────────────────────────────────────────

export const fees: FeeRecord[] = [
  { id: 'FEE01', studentId: 'S001', type: 'Tuition Fee (Sem 3)', amount: 45000, status: 'paid', dueDate: '2024-01-15', paidDate: '2024-01-10', receiptNo: 'REC-2024-001' },
  { id: 'FEE02', studentId: 'S001', type: 'Exam Fee (Sem 3)', amount: 1500, status: 'paid', dueDate: '2024-01-20', paidDate: '2024-01-18', receiptNo: 'REC-2024-002' },
  { id: 'FEE03', studentId: 'S001', type: 'Lab Fee (Sem 3)', amount: 3000, status: 'pending', dueDate: '2024-02-28' },
  { id: 'FEE04', studentId: 'S001', type: 'Library Fee', amount: 500, status: 'overdue', dueDate: '2024-01-01' },
];

// ─── Notices ─────────────────────────────────────────────────────────────────

export const notices: Notice[] = [
  { id: 'N01', title: 'Semester Exam Schedule Released', content: 'The semester examination schedule for Sem 3 has been released. Please check the notice board and prepare accordingly. Exams commence from March 15, 2024.', type: 'exam', priority: 'high', publishedAt: '2024-02-01', publishedBy: 'Examination Cell' },
  { id: 'N02', title: 'Annual Tech Fest - TechZone 2024', content: 'Our annual technical festival TechZone 2024 is scheduled for February 20-22. All students are encouraged to participate in various events, hackathons, and workshops.', type: 'college', priority: 'medium', publishedAt: '2024-01-28', publishedBy: 'Student Council' },
  { id: 'N03', title: 'CS Department Seminar on AI/ML', content: 'The Computer Science department is organizing a seminar on Artificial Intelligence and Machine Learning on February 10, 2024. Attendance is mandatory for CS students.', type: 'department', priority: 'medium', publishedAt: '2024-01-25', publishedBy: 'CS Department' },
  { id: 'N04', title: 'Holiday Notice - Republic Day', content: 'The institute will remain closed on January 26 (Republic Day). Classes will resume normally on January 27, 2024.', type: 'college', priority: 'low', publishedAt: '2024-01-24', publishedBy: 'Administration' },
];

// ─── Leaves ───────────────────────────────────────────────────────────────────

export const leaves: LeaveApplication[] = [
  { id: 'L01', applicantId: 'S001', type: 'medical', fromDate: '2024-01-20', toDate: '2024-01-22', reason: 'Fever and flu symptoms. Doctor advised rest for 3 days.', status: 'approved', appliedAt: '2024-01-20', reviewedBy: 'Dr. Ramesh Kumar' },
  { id: 'L02', applicantId: 'S001', type: 'casual', fromDate: '2024-02-05', toDate: '2024-02-05', reason: 'Family function.', status: 'pending', appliedAt: '2024-02-01' },
  { id: 'L03', applicantId: 'S001', type: 'emergency', fromDate: '2023-11-10', toDate: '2023-11-12', reason: 'Family emergency.', status: 'rejected', appliedAt: '2023-11-10', reviewedBy: 'Dr. Ramesh Kumar' },
];

// ─── Timetable ───────────────────────────────────────────────────────────────

export const timetable: TimetableSlot[] = [
  { id: 'T01', day: 'Monday', startTime: '09:00', endTime: '10:00', subjectId: 'SUB01', subjectName: 'Data Structures', facultyName: 'Dr. Ramesh Kumar', room: 'CS-101' },
  { id: 'T02', day: 'Monday', startTime: '10:00', endTime: '11:00', subjectId: 'SUB02', subjectName: 'Database Management', facultyName: 'Prof. Anita Nair', room: 'CS-102' },
  { id: 'T03', day: 'Monday', startTime: '14:00', endTime: '15:00', subjectId: 'SUB03', subjectName: 'Operating Systems', facultyName: 'Dr. Suresh Iyer', room: 'CS-103' },
  { id: 'T04', day: 'Tuesday', startTime: '09:00', endTime: '10:00', subjectId: 'SUB04', subjectName: 'Computer Networks', facultyName: 'Prof. Kavita Rao', room: 'CS-104' },
  { id: 'T05', day: 'Tuesday', startTime: '11:00', endTime: '13:00', subjectId: 'SUB01', subjectName: 'Data Structures Lab', facultyName: 'Dr. Ramesh Kumar', room: 'CS-Lab1' },
  { id: 'T06', day: 'Wednesday', startTime: '09:00', endTime: '10:00', subjectId: 'SUB05', subjectName: 'Software Engineering', facultyName: 'Dr. Ramesh Kumar', room: 'CS-101' },
  { id: 'T07', day: 'Wednesday', startTime: '10:00', endTime: '11:00', subjectId: 'SUB03', subjectName: 'Operating Systems', facultyName: 'Dr. Suresh Iyer', room: 'CS-103' },
  { id: 'T08', day: 'Thursday', startTime: '09:00', endTime: '10:00', subjectId: 'SUB02', subjectName: 'Database Management', facultyName: 'Prof. Anita Nair', room: 'CS-102' },
  { id: 'T09', day: 'Thursday', startTime: '14:00', endTime: '16:00', subjectId: 'SUB02', subjectName: 'DBMS Lab', facultyName: 'Prof. Anita Nair', room: 'CS-Lab2' },
  { id: 'T10', day: 'Friday', startTime: '09:00', endTime: '10:00', subjectId: 'SUB04', subjectName: 'Computer Networks', facultyName: 'Prof. Kavita Rao', room: 'CS-104' },
  { id: 'T11', day: 'Friday', startTime: '10:00', endTime: '11:00', subjectId: 'SUB05', subjectName: 'Software Engineering', facultyName: 'Dr. Ramesh Kumar', room: 'CS-101' },
];
