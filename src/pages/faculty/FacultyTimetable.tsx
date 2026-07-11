import { useMockDB } from '../../context/MockDB';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
const COLORS = [
  'bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
];

export function FacultyTimetable() {
  const { state } = useMockDB();
  const { user } = useAuth();

  const myTimetable = state.timetable.filter(t =>
    t.facultyName === user?.name || t.facultyName === 'Dr. Ramesh Kumar'
  );

  const subjectColors: Record<string, string> = {};
  myTimetable.forEach(t => {
    if (!subjectColors[t.subjectId]) {
      subjectColors[t.subjectId] = COLORS[Object.keys(subjectColors).length % COLORS.length];
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Timetable</h1>
          <p className="page-subtitle">Your weekly teaching schedule</p>
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 w-24">Time</th>
              {DAYS.map(day => (
                <th key={day} className="px-3 py-3 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES.map(time => (
              <tr key={time} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{time}</td>
                {DAYS.map(day => {
                  const slot = myTimetable.find(t => t.day === day && t.startTime === time);
                  return (
                    <td key={day} className="px-2 py-2 align-top">
                      {slot && (
                        <div className={cn('p-2 rounded-lg border text-xs leading-tight', subjectColors[slot.subjectId])}>
                          <p className="font-semibold">{slot.subjectName}</p>
                          <p className="opacity-70 mt-0.5">{slot.room}</p>
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
