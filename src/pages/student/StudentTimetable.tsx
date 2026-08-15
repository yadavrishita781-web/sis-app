import { useQuery } from '@tanstack/react-query';
import { academicService } from '../../services/academicService';
import { cn } from '../../utils';
import { Loader2 } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
const COLORS = [
  'bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
];

export function StudentTimetable() {
  const { data: timetable = [], isLoading } = useQuery({
    queryKey: ['timetable'],
    queryFn: () => academicService.getTimetable()
  });

  const subjectColors: Record<string, string> = {};
  timetable.forEach((t: any) => {
    const key = t.subjectId || t.subject_id || t.subjectName || t.subject_name;
    if (!subjectColors[key]) {
      subjectColors[key] = COLORS[Object.keys(subjectColors).length % COLORS.length];
    }
  });

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Timetable</h1>
          <p className="page-subtitle">Weekly class schedule</p>
        </div>
      </div>

      {/* Today highlight */}
      <div className="card">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Today ({today})</h2>
        <div className="flex gap-3 flex-wrap">
          {timetable.filter((t: any) => t.day === today).length === 0 ? (
            <p className="text-slate-400 text-sm">No classes today</p>
          ) : timetable.filter((t: any) => t.day === today).map((slot: any) => {
            const key = slot.subjectId || slot.subject_id || slot.subjectName || slot.subject_name;
            return (
              <div key={slot.id} className={cn('px-4 py-3 rounded-xl border text-sm', subjectColors[key] || COLORS[0])}>
                <p className="font-semibold">{slot.subjectName || slot.subject_name}</p>
                <p className="text-xs opacity-70 mt-0.5">{slot.startTime || slot.start_time}–{slot.endTime || slot.end_time} · {slot.room}</p>
                <p className="text-xs opacity-60 mt-0.5">{slot.facultyName || slot.faculty_name}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <th className="px-4 py-3 text-left font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-700 w-24">Time</th>
              {DAYS.map(day => (
                <th key={day} className={cn('px-3 py-3 font-semibold border-b border-slate-200 dark:border-slate-700 text-center',
                  day === today ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                )}>
                  {day}
                  {day === today && <span className="ml-1 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full px-1.5 py-0.5">Today</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES.map(time => (
              <tr key={time} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{time}</td>
                {DAYS.map(day => {
                  const slot: any = timetable.find((t: any) => t.day === day && (t.startTime === time || t.start_time === time));
                  const key = slot ? (slot.subjectId || slot.subject_id || slot.subjectName || slot.subject_name) : '';
                  return (
                    <td key={day} className={cn('px-2 py-2 align-top border-l border-slate-100 dark:border-slate-800/50',
                      day === today ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''
                    )}>
                      {slot && (
                        <div className={cn('p-2 rounded-lg border text-xs leading-tight', subjectColors[key] || COLORS[0])}>
                          <p className="font-semibold">{slot.subjectName || slot.subject_name}</p>
                          <p className="opacity-70 mt-0.5">{slot.room}</p>
                          <p className="opacity-60 mt-0.5">{(slot.facultyName || slot.faculty_name)?.split(' ').pop()}</p>
                        </div>
                      )}
                    </td>
                  );
                })}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


