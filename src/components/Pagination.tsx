import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
            p === page
              ? 'bg-indigo-600 text-white'
              : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          )}
        >
          {p}
        </button>
      ))}
      <button
        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <span className="text-sm text-slate-500 ml-2">
        Page {page} of {totalPages}
      </span>
    </div>
  );
}
