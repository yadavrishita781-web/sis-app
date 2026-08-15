/**
 * Central dropdown options used across all SIS forms.
 * Import from here — never hardcode options in components.
 */

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
];

export const DESIGNATIONS = [
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  'Professor & HOD',
  'Visiting Lecturer',
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const SECTIONS = ['A', 'B', 'C', 'D'];

export const GENDERS = ['Male', 'Female', 'Other'];

export const BATCHES = [
  '2021-2025',
  '2022-2026',
  '2023-2027',
  '2024-2028',
];

export const LEAVE_TYPES = [
  { value: 'medical', label: 'Medical Leave' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'emergency', label: 'Emergency Leave' },
  { value: 'other', label: 'Other' },
];

export const NOTICE_TYPES = [
  { value: 'exam', label: 'Examination' },
  { value: 'college', label: 'College Event' },
  { value: 'department', label: 'Department' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'general', label: 'General' },
];

export const NOTICE_PRIORITIES = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const FEE_TYPES = [
  'Tuition Fee (Semester 1)',
  'Tuition Fee (Semester 2)',
  'Tuition Fee (Semester 3)',
  'Tuition Fee (Semester 4)',
  'Tuition Fee (Semester 5)',
  'Tuition Fee (Semester 6)',
  'Tuition Fee (Semester 7)',
  'Tuition Fee (Semester 8)',
  'Hostel & Mess Fee',
  'Examination Fee',
  'Library Fee',
  'Lab Fee',
  'Transportation Fee',
  'Development Fee',
];

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TIME_SLOTS = [
  '08:00', '09:00', '09:15', '10:00', '10:15', '11:00',
  '11:15', '11:30', '12:00', '12:30', '13:00', '14:00',
  '14:15', '15:00', '15:15', '16:00',
];

export const SUBJECT_CREDITS = [1, 2, 3, 4, 5];

export const EXPERIENCE_OPTIONS = [
  '0–1 Years', '1–3 Years', '3–5 Years', '5–8 Years',
  '8–12 Years', '12–15 Years', '15+ Years',
];
