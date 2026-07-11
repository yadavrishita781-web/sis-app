import { useState } from 'react';
import { timetable } from '../../services/dummyData';
import { cn } from '../../utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
const COLORS = ['bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-violet-100 border-violet-300 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  'bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'];

export function StudentTimetable() {
  const [view, setView] = useState<'weekly' | 'daily'>('weekly');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const subjectColors: Record<string, string> = {};
  timetable.forEach(t => {
    if (!subjectColors[t.subjectId]) {
      subjectColors[t.subjectId] = COLORS[Object.keys(subjectColors).length % COLORS.length];
    }
  });

  const displaySlots = view === 'daily'
    ? timetable.filter(t => t.day === selectedDay)
    : timetable;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Timetable</h1>
          <p className="page-subtitle">Semester 3 — Weekly Schedule</p>
        </div>
        <div className="flex items-center gap-2">
          {view === 'daily' && (
            <select
              value={selectedDay}
              onChange={e => setSelectedDay(e.target.value)}
              className="input w-auto"
            >
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          )}
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {(['weekly', 'daily'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn('px-4 py-2 text-sm font-medium capitalize transition-colors',
                  view === v
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === 'weekly' ? (
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
                    const slot = timetable.find(t => t.day === day && t.startTime === time);
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
      ) : (
        <div className="space-y-3">
          {displaySlots.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-slate-400">No classes on {selectedDay}</p>
            </div>
          ) : (
            displaySlots.map(slot => (
              <div key={slot.id} className="card flex items-center gap-4">
                <div className="text-center w-24 flex-shrink-0">
                  <p className="font-mono text-sm font-semibold text-indigo-600">{slot.startTime}</p>
                  <p className="text-xs text-slate-400">to {slot.endTime}</p>
                </div>
                <div className="h-10 w-0.5 bg-indigo-200 dark:bg-indigo-800" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{slot.subjectName}</p>
                  <p className="text-sm text-slate-500">{slot.facultyName} · Room: {slot.room}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
