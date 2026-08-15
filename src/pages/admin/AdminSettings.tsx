import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { cn } from '../../utils';
import { auth } from '../../firebase/config';
import { updatePassword } from 'firebase/auth';

import { operationService } from '../../services/operationService';

export function AdminSettings() {
  const [settings, setSettings] = useState({

    academicSession: '2024-2025',
    activeSemester: 'odd',
    collegeName: 'Institute of Technology',
    contactEmail: 'admin@institute.edu',
    collegeAddress: '123 Education Hub, Knowledge Park'
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    operationService.getSettings().then(data => {
      if (data && Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    });
  }, []);

  const handleSave = async () => {
    await operationService.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' });
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState('');

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



  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure global application parameters</p>
        </div>
        <button onClick={handleSave} className={cn('btn-primary', saved && 'bg-emerald-600 hover:bg-emerald-700')}>
          {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </div>

      <div className="card space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Academic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Current Academic Session</label><input className="input" defaultValue="2023-2024" /></div>
            <div>
              <label className="label">Current Active Semester</label>
              <select className="input" defaultValue="odd"><option value="odd">Odd Semester</option><option value="even">Even Semester</option></select>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">College Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">College Name</label><input className="input" defaultValue="Institute of Technology" /></div>
            <div><label className="label">Contact Email</label><input className="input" defaultValue="admin@institute.edu" /></div>
            <div className="sm:col-span-2"><label className="label">College Address</label><textarea className="input resize-none" rows={2} defaultValue="123 Education Hub, Knowledge Park" /></div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
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
    </div>
  );
}
