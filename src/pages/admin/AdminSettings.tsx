import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { cn } from '../../utils';

export function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

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
      </div>
    </div>
  );
}
