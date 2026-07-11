import { cn } from '../utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap: Record<string, string> = {
  // Attendance
  present: 'badge-green',
  absent:  'badge-red',
  late:    'badge-yellow',
  // Assignments
  pending:   'badge-yellow',
  submitted: 'badge-blue',
  graded:    'badge-green',
  // Fees
  paid:    'badge-green',
  overdue: 'badge-red',
  // Leave
  approved: 'badge-green',
  rejected: 'badge-red',
  // Result
  pass: 'badge-green',
  fail: 'badge-red',
  // Priority
  high:   'badge-red',
  medium: 'badge-yellow',
  low:    'badge-blue',
  // General
  active:   'badge-green',
  inactive: 'badge-gray',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cls = statusMap[status.toLowerCase()] ?? 'badge-gray';
  return (
    <span className={cn(cls, className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
