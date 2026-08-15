import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../../services/studentService';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../firebase/config';
import { updatePassword } from 'firebase/auth';
import { Save, CheckCircle, Camera, Loader2 } from 'lucide-react';
import { cn } from '../../utils';

export function StudentProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const avatarRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myStudentProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return studentService.getStudentById(user.id);
    },
    enabled: !!user?.id,
  });

  const [form, setForm] = useState({ name: '', phone: '', address: '', parent_name: '', parent_phone: '' });
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || user?.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        parent_name: profile.parentName || (profile as any).parent_name || '',
        parent_phone: profile.parentPhone || (profile as any).parent_phone || '',
      });
      setAvatar(profile.avatar);
    }
  }, [profile, user]);


  const updateMutation = useMutation({
    mutationFn: (data: any) => {
      if (!user?.id) throw new Error("No user id");
      return studentService.updateStudent(user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myStudentProfile', user?.id] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    try {
      const url = await storageService.uploadFile(`avatars/${user.id}/${Date.now()}_${file.name}`, file);
      setAvatar(url);
      await studentService.updateStudent(user.id, { avatar: url });
      queryClient.invalidateQueries({ queryKey: ['myStudentProfile', user?.id] });
    } catch (err: any) {
      alert(err.message || "Failed to upload avatar");
    }
  };

  const handleSave = () => {
    updateMutation.mutate({
      name: form.name,
      phone: form.phone,
      address: form.address,
      parentName: form.parent_name,
      parentPhone: form.parent_phone,
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.newPass !== password.confirm) { setPwdError('Passwords do not match'); return; }
    if (password.newPass.length < 6) { setPwdError('Minimum 6 characters'); return; }
    if (!auth.currentUser) return;
    setPwdError('');
    try {
      await updatePassword(auth.currentUser, password.newPass);
      setPwdSaved(true);
      setPassword({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setPwdSaved(false), 2000);
    } catch (err: any) {
      setPwdError(err.message || 'Failed to update password. You may need to re-login.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const currentProfile = profile || {
    name: user?.name || 'Student',
    roll_no: 'CS-2024-001',
    rollNo: 'CS-2024-001',
    department: 'Computer Science & Engineering',
    semester: 4,
    section: 'A',
    batch: '2022-2026',
    avatar: ''
  };

  const displayAvatar = avatar || currentProfile.avatar;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal information</p>
        </div>
        <button onClick={handleSave} disabled={updateMutation.isPending} className={cn('btn-primary', saved && 'bg-emerald-600 hover:bg-emerald-700')}>
          {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> {updateMutation.isPending ? 'Saving...' : 'Save Changes'}</>}
        </button>
      </div>

      {/* Avatar + basic */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Profile Information</h2>
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            {displayAvatar
              ? <img src={displayAvatar} className="h-24 w-24 rounded-2xl object-cover ring-4 ring-indigo-100 dark:ring-indigo-900/40" alt="Avatar" />
              : <div className="h-24 w-24 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-4xl font-bold text-indigo-700 dark:text-indigo-300">
                  {(currentProfile.name || user?.name || 'S').charAt(0)}
                </div>
            }
            <button onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-1.5 bg-indigo-600 rounded-full text-white shadow-lg hover:bg-indigo-700 transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{form.name || currentProfile.name}</h3>
            <p className="text-slate-500 mt-0.5">{currentProfile.rollNo || (currentProfile as any).roll_no} · {currentProfile.department}</p>
            <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className="label">Email (readonly)</label><input className="input bg-slate-50 dark:bg-slate-700" value={user?.email || ''} readOnly /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div><label className="label">Roll Number (readonly)</label><input className="input bg-slate-50 dark:bg-slate-700 font-mono" value={currentProfile.rollNo || (currentProfile as any).roll_no} readOnly /></div>

          <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
          <div><label className="label">Parent Name</label><input className="input" value={form.parent_name} onChange={e => setForm({...form, parent_name: e.target.value})} /></div>
          <div><label className="label">Parent Phone</label><input className="input" value={form.parent_phone} onChange={e => setForm({...form, parent_phone: e.target.value})} /></div>
        </div>
      </div>

      {/* Academic Info (read-only) */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Academic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            ['Department', currentProfile.department],
            ['Semester', `Semester ${currentProfile.semester || 4}`],
            ['Section', currentProfile.section || 'A'],
            ['Batch', currentProfile.batch || '2022-2026'],
          ].map(([l, v]) => (
            <div key={l}>
              <p className="text-xs text-slate-400 uppercase tracking-wider">{l}</p>
              <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">{v || '—'}</p>
            </div>
          ))}
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

