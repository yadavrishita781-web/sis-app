import { StudyMaterial } from '../types';
import { storageService } from './storageService';
import { FirestoreCollection } from './dbHelper';

const INITIAL_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Unit 1: Balanced Trees & Hashing Lecture Notes',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'DSA_Unit1_Balanced_Trees.pdf',
    size: '2.4 MB',
    uploadedBy: 'Prof. Suraj Sharma',
    uploadedAt: '2026-08-01',
  },
  {
    id: 'mat-2',
    title: 'Database Transactions & Concurrency Control Slides',
    subjectId: 'sub-2',
    subjectName: 'Database Management Systems',
    type: 'ppt',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'DBMS_Transactions_ACID.pptx',
    size: '4.8 MB',
    uploadedBy: 'Dr. Priya Mehta',
    uploadedAt: '2026-08-05',
  },
  {
    id: 'mat-3',
    title: 'Socket Programming in Linux & Windows Guide',
    subjectId: 'sub-3',
    subjectName: 'Computer Networks',
    type: 'docx',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'CN_Socket_Programming_Lab_Manual.docx',
    size: '1.1 MB',
    uploadedBy: 'Prof. Rajesh Verma',
    uploadedAt: '2026-08-08',
  },
];

const materialStore = new FirestoreCollection<StudyMaterial>('materials', INITIAL_MATERIALS);

export const materialService = {
  async getMaterials(subjectId?: string): Promise<StudyMaterial[]> {
    const all = await materialStore.getAll();
    return subjectId ? all.filter(m => m.subjectId === subjectId) : all;
  },

  async uploadMaterial(data: Partial<StudyMaterial>, file?: File): Promise<StudyMaterial> {
    const id = data.id || `mat-${Date.now()}`;
    let fileUrl = data.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    let fileName = data.fileName || 'document.pdf';
    let size = data.size || '1.0 MB';

    if (file) {
      fileUrl = await storageService.uploadFile(`materials/${data.subjectId || 'general'}/${Date.now()}_${file.name}`, file);
      fileName = file.name;
      size = (file.size / 1024).toFixed(1) + ' KB';
    }

    const material: StudyMaterial = {
      id,
      title: data.title || 'New Study Material',
      subjectId: data.subjectId || 'sub-1',
      subjectName: data.subjectName || 'Data Structures',
      type: (data.type as any) || (fileName.endsWith('.ppt') || fileName.endsWith('.pptx') ? 'ppt' : fileName.endsWith('.docx') ? 'docx' : 'pdf'),
      url: fileUrl,
      fileName,
      size,
      uploadedBy: data.uploadedBy || 'Faculty Member',
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    return materialStore.add(material);
  },

  async createMaterial(data: Partial<StudyMaterial>, file?: File): Promise<StudyMaterial> {
    return this.uploadMaterial(data, file);
  },

  async deleteMaterial(id: string): Promise<void> {
    return materialStore.remove(id);
  }
};
