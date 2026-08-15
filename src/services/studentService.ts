import { Student } from '../types';
import { authService } from './authService';
import { FirestoreCollection } from './dbHelper';

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Rishita Yadav',
    rollNo: '21CS001',
    email: 'rishita@sis.edu',
    phone: '+91 98765 43210',
    department: 'Computer Science & Engineering',
    semester: 6,
    section: 'A',
    batch: '2021-2025',
    dob: '2003-05-14',
    gender: 'Female',
    address: 'Sector 62, Noida, UP',
    parentName: 'Mr. R. K. Yadav',
    parentPhone: '+91 98765 00000',
  },
  {
    id: 'std-2',
    name: 'Aarav Patel',
    rollNo: '21CS002',
    email: 'aarav@sis.edu',
    phone: '+91 98765 43211',
    department: 'Computer Science & Engineering',
    semester: 6,
    section: 'A',
    batch: '2021-2025',
    dob: '2003-08-20',
    gender: 'Male',
    address: 'B-12, Sector 15, Gurgaon, HR',
    parentName: 'Mr. S. Patel',
    parentPhone: '+91 98765 00001',
  },
  {
    id: 'std-3',
    name: 'Diya Sharma',
    rollNo: '21IT001',
    email: 'diya@sis.edu',
    phone: '+91 98765 43212',
    department: 'Information Technology',
    semester: 4,
    section: 'B',
    batch: '2022-2026',
    dob: '2004-01-10',
    gender: 'Female',
    address: 'H-45, Rohini, New Delhi',
    parentName: 'Mr. V. Sharma',
    parentPhone: '+91 98765 00002',
  },
  {
    id: 'std-4',
    name: 'Rohan Mehta',
    rollNo: '21CS003',
    email: 'rohan@sis.edu',
    phone: '+91 97654 32109',
    department: 'Computer Science & Engineering',
    semester: 6,
    section: 'B',
    batch: '2021-2025',
    dob: '2003-11-30',
    gender: 'Male',
    address: 'C-5, Vasant Kunj, New Delhi',
    parentName: 'Mrs. A. Mehta',
    parentPhone: '+91 97654 00003',
  },
  {
    id: 'std-5',
    name: 'Priya Nair',
    rollNo: '22ECE001',
    email: 'priya.n@sis.edu',
    phone: '+91 96543 21098',
    department: 'Electronics & Communication',
    semester: 4,
    section: 'A',
    batch: '2022-2026',
    dob: '2004-03-22',
    gender: 'Female',
    address: 'Kakkanad, Kochi, Kerala',
    parentName: 'Mr. S. Nair',
    parentPhone: '+91 96543 00004',
  },
  {
    id: 'std-6',
    name: 'Arjun Singh',
    rollNo: '23ME001',
    email: 'arjun@sis.edu',
    phone: '+91 95432 10987',
    department: 'Mechanical Engineering',
    semester: 2,
    section: 'A',
    batch: '2023-2027',
    dob: '2005-07-08',
    gender: 'Male',
    address: 'Rajouri Garden, New Delhi',
    parentName: 'Mr. B. Singh',
    parentPhone: '+91 95432 00005',
  },
];

const collectionStore = new FirestoreCollection<Student>('students', INITIAL_STUDENTS);

export const studentService = {
  async getStudents(): Promise<Student[]> {
    return collectionStore.getAll();
  },

  async getStudentById(id: string): Promise<Student | null> {
    const student = await collectionStore.getById(id);
    if (student) return student;
    const all = await collectionStore.getAll();
    return all.find(s => s.id === id || s.email === id) || null;
  },

  async createStudent(data: Partial<Student> & { password?: string }): Promise<Student> {
    const email = data.email || `student_${Date.now()}@sis.edu`;
    const password = data.password || 'student123';
    const name = data.name || 'New Student';
    
    const { uid } = await authService.createAccountByAdmin(email, password, 'student', name, data);
    
    const newStudent: Student = {
      id: uid,
      name,
      email,
      rollNo: data.rollNo || `24CS${Math.floor(100 + Math.random() * 900)}`,
      phone: data.phone || '+91 90000 00000',
      department: data.department || 'Computer Science & Engineering',
      semester: Number(data.semester) || 1,
      section: data.section || 'A',
      batch: data.batch || '2024-2028',
      dob: data.dob || '2005-01-01',
      gender: data.gender || 'Male',
      address: data.address || '',
      parentName: data.parentName || '',
      parentPhone: data.parentPhone || '',
      avatar: data.avatar || ''
    };

    return collectionStore.add(newStudent);
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    return collectionStore.update(id, data);
  },

  async deleteStudent(id: string): Promise<void> {
    return collectionStore.remove(id);
  }
};
