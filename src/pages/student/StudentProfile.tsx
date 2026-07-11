import { useState, useRef } from 'react';
import { useMockDB } from '../../context/MockDB';
import { useAuth } from '../../hooks/useAuth';
import { Save, CheckCircle, Camera } from 'lucide-react';
import { cn } from '../../utils';

export function StudentProfile() {
  const { state, updateProfile, getProfile, updateStudent, changePassword } = useMockDB();
  const { user } = useAuth();
  const avatarRef = useRef<HTMLInputElement>(null);

  const studentId = user?.id || 'S001';
  const student = state.students.find(s => s.id === studentId) || state.students[0];

  const stored = getProfile(studentId, {
    name: student?.name || '', phone: student?.phone || '',
    address: student?.address || '', avatar: student?.avatar,
  });

  const [form, setForm] = useState({ name: stored.name, phone: stored.phone, address: stored.address || '' });
  const [avatar, setAvatar] = useState<string | undefined>(stored.avatar);
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const handleSave = () => {
    updateProfile({ userId: studentId, name: form.name, phone: form.phone, address: form.address, avatar });
    if (student) {
      updateStudent({ ...student, name: form.name, phone: form.phone, address: form.address, avatar });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.newPass !== password.confirm) { setPwdError('Passwords do not match'); return; }
    if (password.newPass.length < 6) { setPwdError('Minimum 6 characters'); return; }
    setPwdError('');
    changePassword(student.email, password.newPass);
    setPwdSaved(true);
    setPassword({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPwdSaved(false), 2000);
  };

  if (!student) return <p className="text-slate-400 p-8">No student profile found.</p>;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal information</p>
        </div>
        <button onClick={handleSave} className={cn('btn-primary', saved && 'bg-emerald-600 hover:bg-emerald-700')}>
          {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </div>

      {/* Avatar + basic */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Profile Information</h2>
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            {avatar
              ? <img src={avatar} className="h-24 w-24 rounded-2xl object-cover ring-4 ring-indigo-100 dark:ring-indigo-900/40" alt="Avatar" />
              : <div className="h-24 w-24 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-4xl font-bold text-indigo-700 dark:text-indigo-300">
                  {student.name.charAt(0)}
                </div>
            }
            <button onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-1.5 bg-indigo-600 rounded-full text-white shadow-lg hover:bg-indigo-700 transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{form.name || student.name}</h3>
            <p className="text-slate-500 mt-0.5">{student.rollNo} · {student.department}</p>
            <p className="text-slate-400 text-sm mt-0.5">{student.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className="label">Email (readonly)</label><input className="input bg-slate-50 dark:bg-slate-700" value={student.email} readOnly /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div><label className="label">Roll Number (readonly)</label><input className="input bg-slate-50 dark:bg-slate-700 font-mono" value={student.rollNo} readOnly /></div>
          <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
        </div>
      </div>

      {/* Academic Info (read-only) */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Academic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            ['Department', student.department],
            ['Semester', `Semester ${student.semester}`],
            ['Section', student.section],
            ['Batch', student.batch],
            ['Gender', student.gender],
            ['Date of Birth', student.dob],
          ].map(([l, v]) => (
            <div key={l}>
              <p className="text-xs text-slate-400 uppercase tracking-wider">{l}</p>
              <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">{v || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Parent Info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Parent / Guardian</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Parent Name</p>
            <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">{student.parentName || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Parent Phone</p>
            <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">{student.parentPhone || '—'}</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div><label className="label">Current Password</label><input type="password" className="input" value={password.current} onChange={e => setPassword({...password, current: e.target.value})} required /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">New Password</label><input type="password" className="input" value={password.newPass} onChange={e => setPassword({...password, newPass: e.target.value})} required /></div>
            <div><label className="label">Confirm Password</label><input type="password" className="input" value={password.confirm} onChange={e => setPassword({...password, confirm: e.target.value})} required /></div>
          </div>
          {pwdError && <p className="text-sm text-red-600">{pwdError}</p>}
          <button type="submit" className={cn('btn-primary', pwdSaved && 'bg-emerald-600 hover:bg-emerald-700')}>
            {pwdSaved ? <><CheckCircle className="h-4 w-4" /> Password Changed!</> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
