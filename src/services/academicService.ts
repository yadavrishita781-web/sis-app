import { Department, Subject, TimetableSlot } from '../types';
import { FirestoreCollection } from './dbHelper';

const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. Priya Mehta', totalStudents: 240, totalFaculty: 18 },
  { id: 'dept-2', name: 'Information Technology', code: 'IT', hod: 'Dr. Rajesh Verma', totalStudents: 180, totalFaculty: 14 },
  { id: 'dept-3', name: 'Electronics & Communication', code: 'ECE', hod: 'Dr. Neha Gupta', totalStudents: 120, totalFaculty: 10 },
  { id: 'dept-4', name: 'Mechanical Engineering', code: 'ME', hod: 'Dr. Arun Kumar', totalStudents: 90, totalFaculty: 8 },
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'Data Structures & Algorithms', code: 'CS301', credits: 4, department: 'Computer Science & Engineering', semester: 3, facultyId: 'fac-1', facultyName: 'Prof. Suraj Sharma' },
  { id: 'sub-2', name: 'Database Management Systems', code: 'CS302', credits: 4, department: 'Computer Science & Engineering', semester: 4, facultyId: 'fac-2', facultyName: 'Dr. Priya Mehta' },
  { id: 'sub-3', name: 'Computer Networks', code: 'IT401', credits: 3, department: 'Information Technology', semester: 4, facultyId: 'fac-3', facultyName: 'Prof. Rajesh Verma' },
  { id: 'sub-4', name: 'Operating Systems', code: 'CS303', credits: 4, department: 'Computer Science & Engineering', semester: 4, facultyId: 'fac-1', facultyName: 'Prof. Suraj Sharma' },
  { id: 'sub-5', name: 'Cloud Computing & DevOps', code: 'CS501', credits: 3, department: 'Computer Science & Engineering', semester: 5, facultyId: 'fac-2', facultyName: 'Dr. Priya Mehta' },
];

const INITIAL_TIMETABLE: TimetableSlot[] = [
  { id: 'tt-1', day: 'Monday', startTime: '09:00', endTime: '10:00', subjectId: 'sub-1', subjectName: 'Data Structures & Algorithms', facultyName: 'Prof. Suraj Sharma', room: 'Lab 3', department: 'Computer Science', semester: 6 },
  { id: 'tt-2', day: 'Monday', startTime: '10:15', endTime: '11:15', subjectId: 'sub-2', subjectName: 'Database Management Systems', facultyName: 'Dr. Priya Mehta', room: 'Room 204', department: 'Computer Science', semester: 6 },
  { id: 'tt-3', day: 'Tuesday', startTime: '09:00', endTime: '10:00', subjectId: 'sub-4', subjectName: 'Operating Systems', facultyName: 'Prof. Suraj Sharma', room: 'Room 105', department: 'Computer Science', semester: 6 },
  { id: 'tt-4', day: 'Wednesday', startTime: '11:30', endTime: '12:30', subjectId: 'sub-5', subjectName: 'Cloud Computing', facultyName: 'Dr. Priya Mehta', room: 'Lab 1', department: 'Computer Science', semester: 6 },
  { id: 'tt-5', day: 'Thursday', startTime: '14:00', endTime: '15:00', subjectId: 'sub-3', subjectName: 'Computer Networks', facultyName: 'Prof. Rajesh Verma', room: 'Room 302', department: 'Computer Science', semester: 6 },
  { id: 'tt-6', day: 'Friday', startTime: '10:00', endTime: '11:00', subjectId: 'sub-1', subjectName: 'Data Structures & Algorithms', facultyName: 'Prof. Suraj Sharma', room: 'Lab 3', department: 'Computer Science', semester: 6 },
];

const deptStore = new FirestoreCollection<Department>('departments', INITIAL_DEPARTMENTS);
const subjectStore = new FirestoreCollection<Subject>('subjects', INITIAL_SUBJECTS);
const timetableStore = new FirestoreCollection<TimetableSlot>('timetable', INITIAL_TIMETABLE);

export const academicService = {
  // ─── Departments ───
  async getDepartments(): Promise<Department[]> {
    return deptStore.getAll();
  },

  async createDepartment(data: Partial<Department>): Promise<Department> {
    const id = data.id || `dept-${Date.now()}`;
    const dept: Department = {
      id,
      name: data.name || 'New Department',
      code: data.code || 'DEPT',
      hod: data.hod || 'TBD',
      totalStudents: Number(data.totalStudents) || 0,
      totalFaculty: Number(data.totalFaculty) || 0
    };
    return deptStore.add(dept);
  },

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    return deptStore.update(id, data);
  },

  async deleteDepartment(id: string): Promise<void> {
    return deptStore.remove(id);
  },

  // ─── Subjects ───
  async getSubjects(): Promise<Subject[]> {
    return subjectStore.getAll();
  },

  async createSubject(data: Partial<Subject>): Promise<Subject> {
    const id = data.id || `sub-${Date.now()}`;
    const sub: Subject = {
      id,
      name: data.name || 'New Subject',
      code: data.code || 'CS000',
      credits: Number(data.credits) || 3,
      department: data.department || 'Computer Science',
      semester: Number(data.semester) || 1,
      facultyId: data.facultyId || '',
      facultyName: data.facultyName || 'TBD'
    };
    return subjectStore.add(sub);
  },

  async updateSubject(id: string, data: Partial<Subject>): Promise<Subject> {
    return subjectStore.update(id, data);
  },

  async deleteSubject(id: string): Promise<void> {
    return subjectStore.remove(id);
  },

  // ─── Timetable ───
  async getTimetable(): Promise<TimetableSlot[]> {
    return timetableStore.getAll();
  },

  async createTimetableSlot(data: Partial<TimetableSlot>): Promise<TimetableSlot> {
    const id = data.id || `tt-${Date.now()}`;
    const slot: TimetableSlot = {
      id,
      day: data.day || 'Monday',
      startTime: data.startTime || '09:00',
      endTime: data.endTime || '10:00',
      subjectId: data.subjectId || '',
      subjectName: data.subjectName || 'Subject',
      facultyName: data.facultyName || 'Faculty',
      room: data.room || 'Room 101',
      department: data.department || 'Computer Science',
      semester: Number(data.semester) || 1
    };
    return timetableStore.add(slot);
  },

  async updateTimetableSlot(id: string, data: Partial<TimetableSlot>): Promise<TimetableSlot> {
    return timetableStore.update(id, data);
  },

  async deleteTimetableSlot(id: string): Promise<void> {
    return timetableStore.remove(id);
  }
};
