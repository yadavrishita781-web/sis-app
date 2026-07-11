import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getGradeColor(grade: string) {
  const map: Record<string, string> = {
    'O': 'text-emerald-600',
    'A+': 'text-green-600',
    'A': 'text-blue-600',
    'B+': 'text-indigo-600',
    'B': 'text-yellow-600',
    'C': 'text-orange-600',
    'F': 'text-red-600',
  };
  return map[grade] ?? 'text-gray-600';
}

export function getAttendanceColor(pct: number) {
  if (pct >= 85) return 'text-emerald-600';
  if (pct >= 75) return 'text-yellow-600';
  return 'text-red-600';
}
