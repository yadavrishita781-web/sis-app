import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { students } from '../../services/dummyData';
import { User, Lock, Users, ChevronRight } from 'lucide-react';
import { cn } from '../../utils';

const TABS = [
  { id: 'personal',  label: 'Personal Details', icon: User },
  { id: 'academic',  label: 'Academic Details', icon: Users },
  { id: 'parent',    label: 'Parent Details',   icon: Users },
  { id: 'password',  label: 'Change Password',  icon: Lock },
];

export function StudentProfile() {
  const { user } = useAuth();
  const student = students.find(s => s.id === user?.id) ?? students[0];
  const [tab, setTab] = useState('personal');
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-slate-800 dark:text-slate-200 font-medium">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">View and manage your information</p>
        </div>
      </div>

      {/* Profile header card */}
      <div className="card bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-0">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{student.name}</h2>
            <p className="text-indigo-200">{student.rollNo} · {student.department}</p>
            <p className="text-indigo-200 text-sm">Semester {student.semester} · Section {student.section} · {student.batch}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab list */}
        <div className="card p-2 h-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left',
                tab === t.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="lg:col-span-3 card">
          {tab === 'personal' && (
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-5">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" value={student.name} />
                <Field label="Roll Number" value={student.rollNo} />
                <Field label="Email" value={student.email} />
                <Field label="Phone" value={student.phone} />
                <Field label="Date of Birth" value={student.dob} />
                <Field label="Gender" value={student.gender} />
                <div className="sm:col-span-2"><Field label="Address" value={student.address} /></div>
              </div>
            </div>
          )}
          {tab === 'academic' && (
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-5">Academic Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Department" value={student.department} />
                <Field label="Semester" value={`Semester ${student.semester}`} />
                <Field label="Section" value={student.section} />
                <Field label="Batch" value={student.batch} />
                <Field label="Roll Number" value={student.rollNo} />
                <Field label="Student ID" value={student.id} />
              </div>
            </div>
          )}
          {tab === 'parent' && (
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-5">Parent / Guardian Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Parent / Guardian Name" value={student.parentName} />
                <Field label="Contact Number" value={student.parentPhone} />
              </div>
            </div>
          )}
          {tab === 'password' && (
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-5">Change Password</h3>
              <form className="space-y-4 max-w-md" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="label">Current Password</label>
                  <input type="password" className="input" value={pwdForm.current} onChange={e => setPwdForm({ ...pwdForm, current: e.target.value })} />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" value={pwdForm.newPwd} onChange={e => setPwdForm({ ...pwdForm, newPwd: e.target.value })} />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input type="password" className="input" value={pwdForm.confirm} onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary">Update Password</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
