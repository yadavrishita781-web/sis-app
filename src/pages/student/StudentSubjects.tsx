import { subjects } from '../../services/dummyData';
import { BookOpen } from 'lucide-react';

export function StudentSubjects() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Subjects</h1>
          <p className="page-subtitle">Semester 3 — Computer Science</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((sub, i) => {
          const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500'];
          return (
            <div key={sub.id} className="card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${colors[i % colors.length]}`}>
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{sub.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{sub.code}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Faculty</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{sub.facultyName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Credits</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{sub.credits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Semester</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{sub.semester}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
