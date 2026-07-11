import { useState } from 'react';
import { timetable, departments } from '../../services/dummyData';
import { Modal } from '../../components/Modal';
import { Plus, Trash2 } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

export function AdminTimetable() {
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState('3');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Timetable Management</h1>
          <p className="page-subtitle">Schedule classes across departments</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Slot
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <select className="input w-auto" value={department} onChange={e => setDepartment(e.target.value)}>
            {departments.map(d => <option key={d.id}>{d.name}</option>)}
          </select>
          <select className="input w-auto" value={semester} onChange={e => setSemester(e.target.value)}>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
        
        <div className="table-wrapper border-0">
          <table className="table-base min-w-[800px]">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 w-24">Time</th>
                {DAYS.map(day => (
                  <th key={day} className="px-3 py-3 border-b border-slate-200 dark:border-slate-700 text-center">{day}</th>
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
                      <td key={day} className="px-2 py-2 align-top text-center border-l border-slate-100 dark:border-slate-800/50">
                        {slot ? (
                          <div className="group relative inline-block text-left w-full">
                            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 text-xs text-indigo-900 dark:text-indigo-200">
                              <p className="font-semibold">{slot.subjectName}</p>
                              <p className="opacity-70 mt-0.5">{slot.room} · {slot.facultyName.split(' ')[0]}</p>
                            </div>
                            <button className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">-</span>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Timetable Slot"
        footer={<><button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary">Add Slot</button></>}
      >
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Day</label><select className="input">{DAYS.map(d => <option key={d}>{d}</option>)}</select></div>
            <div><label className="label">Time</label><select className="input">{TIMES.map(t => <option key={t}>{t}</option>)}</select></div>
          </div>
          <div><label className="label">Subject</label><input className="input" required placeholder="Select subject..." /></div>
          <div><label className="label">Room</label><input className="input" required placeholder="e.g. CS-101" /></div>
        </form>
      </Modal>
    </div>
  );
}
