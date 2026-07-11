import { useState } from 'react';
import { useMockDB } from '../../context/MockDB';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { LeaveApplication } from '../../types';
import { formatDate } from '../../utils';
import { Plus } from 'lucide-react';

export function StudentLeave() {
  const { state, addLeave } = useMockDB();
  const { user } = useAuth();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type: 'casual' as LeaveApplication['type'], from: '', to: '', reason: '' });
  const [submitted, setSubmitted] = useState(false);

  const studentId = user?.id || 'S001';
  const leaves = state.leaves.filter(l => l.applicantId === studentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLeave({
      applicantId: studentId,
      applicantName: user?.name,
      type: form.type,
      fromDate: form.from,
      toDate: form.to,
      reason: form.reason,
      status: 'pending',
    } as any);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setModal(false); setForm({ type: 'casual', from: '', to: '', reason: '' }); }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Applications</h1>
          <p className="page-subtitle">Apply and track your leave requests</p>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}>
          <Plus className="h-4 w-4" /> Apply Leave
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Applied', value: leaves.length, color: 'text-indigo-600' },
          { label: 'Approved', value: leaves.filter(l => l.status === 'approved').length, color: 'text-emerald-600' },
          { label: 'Pending', value: leaves.filter(l => l.status === 'pending').length, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Leave History</h2>
        <div className="table-wrapper">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Applied</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {leaves.map(l => (
                <tr key={l.id} className="table-row">
                  <td className="table-cell capitalize font-medium">{l.type}</td>
                  <td className="table-cell">{formatDate(l.fromDate)}</td>
                  <td className="table-cell">{formatDate(l.toDate)}</td>
                  <td className="table-cell max-w-xs truncate">{l.reason}</td>
                  <td className="table-cell">{formatDate(l.appliedAt)}</td>
                  <td className="table-cell"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">No leave applications yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Apply for Leave"
        footer={<><button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button><button form="leave-form" type="submit" className="btn-primary" disabled={submitted}>{submitted ? 'Submitted!' : 'Submit Application'}</button></>}
      >
        <form id="leave-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Leave Type</label>
            <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as LeaveApplication['type'] })} required>
              <option value="casual">Casual Leave</option>
              <option value="medical">Medical Leave</option>
              <option value="emergency">Emergency Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">From Date</label><input type="date" className="input" value={form.from} onChange={e => setForm({...form, from: e.target.value})} required /></div>
            <div><label className="label">To Date</label><input type="date" className="input" value={form.to} onChange={e => setForm({...form, to: e.target.value})} required /></div>
          </div>
          <div><label className="label">Reason</label><textarea className="input resize-none" rows={3} value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} placeholder="Brief reason for leave..." required /></div>
        </form>
      </Modal>
    </div>
  );
}
