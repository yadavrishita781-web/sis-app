import { Faculty } from '../types';
import { authService } from './authService';
import { FirestoreCollection } from './dbHelper';

const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'fac-1',
    name: 'Prof. Suraj Sharma',
    email: 'suraj@sis.edu',
    phone: '+91 98111 22233',
    department: 'Computer Science',
    designation: 'Associate Professor',
    experience: '8 Years',
    subjects: ['Data Structures', 'Algorithms', 'Operating Systems'],
  },
  {
    id: 'fac-2',
    name: 'Dr. Priya Mehta',
    email: 'priya@sis.edu',
    phone: '+91 98222 33344',
    department: 'Computer Science',
    designation: 'Professor & HOD',
    experience: '15 Years',
    subjects: ['Database Management', 'Cloud Computing'],
  },
  {
    id: 'fac-3',
    name: 'Prof. Rajesh Verma',
    email: 'rajesh@sis.edu',
    phone: '+91 98333 44455',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    experience: '5 Years',
    subjects: ['Computer Networks', 'Cyber Security'],
  },
];

const collectionStore = new FirestoreCollection<Faculty>('faculty', INITIAL_FACULTY);

export const facultyService = {
  async getFaculty(): Promise<Faculty[]> {
    return collectionStore.getAll();
  },

  async getFacultyById(id: string): Promise<Faculty | null> {
    const faculty = await collectionStore.getById(id);
    if (faculty) return faculty;
    const all = await collectionStore.getAll();
    return all.find(f => f.id === id || f.email === id) || null;
  },

  async createFaculty(data: Partial<Faculty> & { password?: string }): Promise<Faculty> {
    const email = data.email || `faculty_${Date.now()}@sis.edu`;
    const password = data.password || 'faculty123';
    const name = data.name || 'New Faculty';

    const { uid } = await authService.createAccountByAdmin(email, password, 'faculty', name, data);

    const newFaculty: Faculty = {
      id: uid,
      name,
      email,
      phone: data.phone || '+91 98000 00000',
      department: data.department || 'Computer Science',
      designation: data.designation || 'Assistant Professor',
      experience: data.experience || '2 Years',
      subjects: data.subjects || ['Computer Fundamentals'],
      avatar: data.avatar || ''
    };

    return collectionStore.add(newFaculty);
  },

  async updateFaculty(id: string, data: Partial<Faculty>): Promise<Faculty> {
    return collectionStore.update(id, data);
  },

  async deleteFaculty(id: string): Promise<void> {
    return collectionStore.remove(id);
  }
};
