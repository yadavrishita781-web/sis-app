import { useState, useMemo } from 'react';
import { useMockDB } from '../../context/MockDB';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { TimetableSlot } from '../../types';
import { Plus, Trash2, Pencil } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const BLANK: Omit<TimetableSlot, 'id'> = {
  day: 'Monday', startTime: '09:00', endTime: '10:00',
  subjectId: '', subjectName: '', facultyName: '', room: '',
  department: 'Computer Science', semester: 3,
};

export function AdminTimetable() {
  const { state, addTimetableSlot, deleteTimetableSlot, updateTimetableSlot } = useMockDB();
  const [dept, setDept] = useState('Computer Science');
  const [semester, setSemester] = useState(3);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<TimetableSlot | null>(null);
  const [form, setForm] = useState<Omit<TimetableSlot, 'id'>>(BLANK);
  const [confirmDelete, setConfirmDelete] = useState<TimetableSlot | null>(null);

  const slots = useMemo(() =>
    state.timetable.filter(t =>
      (!t.department || t.department === dept) &&
      (!t.semester || t.semester === semester)
    ),
    [state.timetable, dept, semester]
  );

  const openAdd = () => {
    setForm({ ...BLANK, department: dept, semester });
    setModal('add');
  };
  const openEdit = (slot: TimetableSlot) => { setSelected(slot); setForm({ ...slot }); setModal('edit'); };

  const handleSubjectChange = (subjectId: string) => {
    const sub = state.subjects.find(s => s.id === subjectId);
    const fac = state.faculty.find(f => f.id === sub?.facultyId);
    setForm(prev => ({ ...prev, subjectId, subjectName: sub?.name || '', facultyName: fac?.name || '' }));
  };

  const handleSave = () => {
    if (modal === 'add') addTimetableSlot(form);
    else if (modal === 'edit' && selected) updateTimetableSlot({ ...form, id: selected.id });
    setModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Timetable Management</h1>
          <p className="page-subtitle">Schedule classes across departments</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus className="h-4 w-4" /> Add Slot</button>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <select className="input w-auto" value={dept} onChange={e => setDept(e.target.value)}>
            {state.departments.map(d => <option key={d.id}>{d.name}</option>)}
          </select>
          <select className="input w-auto" value={semester} onChange={e => setSemester(+e.target.value)}>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>

        <div className="table-wrapper border-0">
          <table className="table-base min-w-[800px]">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3 w-24">Time</th>
                {DAYS.map(day => <th key={day} className="px-3 py-3 text-center">{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {TIMES.map(time => (
                <tr key={time} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{time}</td>
                  {DAYS.map(day => {
                    const slot = slots.find(t => t.day === day && t.startTime === time);
                    return (
                      <td key={day} className="px-2 py-2 align-top text-center border-l border-slate-100 dark:border-slate-800/50">
                        {slot ? (
                          <div className="group relative inline-block text-left w-full">
                            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 text-xs text-indigo-900 dark:text-indigo-200">
                              <p className="font-semibold">{slot.subjectName}</p>
                              <p className="opacity-70 mt-0.5">{slot.room} · {slot.facultyName.split(' ')[0]}</p>
                            </div>
                            <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1">
                              <button onClick={() => openEdit(slot)} className="p-1 bg-blue-100 text-blue-600 rounded-full shadow-sm hover:bg-blue-200 transition-colors">
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button onClick={() => setConfirmDelete(slot)} className="p-1 bg-red-100 text-red-600 rounded-full shadow-sm hover:bg-red-200 transition-colors">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">–</span>
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

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Timetable Slot' : 'Edit Slot'} size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={handleSave}>Save Slot</button></>}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Day</label>
              <select className="input" value={form.day} onChange={e => setForm({...form, day: e.target.value})}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Start Time</label>
              <select className="input" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})}>
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">End Time</label>
              <select className="input" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})}>
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="label">Room</label><input className="input" value={form.room} onChange={e => setForm({...form, room: e.target.value})} placeholder="e.g. CS-101" /></div>
          </div>
          <div>
            <label className="label">Subject</label>
            <select className="input" value={form.subjectId} onChange={e => handleSubjectChange(e.target.value)}>
              <option value="">Select subject...</option>
              {state.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Faculty (auto-filled)</label>
            <input className="input bg-slate-50 dark:bg-slate-700" value={form.facultyName} readOnly />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Remove Slot" message={`Remove "${confirmDelete?.subjectName}" from ${confirmDelete?.day} ${confirmDelete?.startTime}?`} confirmLabel="Remove"
        onConfirm={() => { deleteTimetableSlot(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}
