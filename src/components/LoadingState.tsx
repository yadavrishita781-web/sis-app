import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
    </div>
  );
}
