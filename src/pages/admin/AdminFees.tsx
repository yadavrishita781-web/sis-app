import { useState, useMemo } from 'react';
import { useMockDB } from '../../context/MockDB';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { StatusBadge } from '../../components/StatusBadge';
import { FeeRecord } from '../../types';
import { formatCurrency, formatDate } from '../../utils';
import { Plus, Pencil, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const BLANK: Omit<FeeRecord, 'id'> = { studentId: 'S001', studentName: '', type: '', amount: 0, status: 'pending', dueDate: '' };

export function AdminFees() {
  const { state, addFee, updateFee, deleteFee, markFeeStatus } = useMockDB();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<FeeRecord | null>(null);
  const [form, setForm] = useState<Omit<FeeRecord, 'id'>>(BLANK);
  const [confirmDelete, setConfirmDelete] = useState<FeeRecord | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return state.fees.filter(f => {
      const student = state.students.find(s => s.id === f.studentId);
      return (
        f.studentId.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q) ||
        (student?.name.toLowerCase().includes(q) ?? false) ||
        (student?.rollNo.toLowerCase().includes(q) ?? false)
      );
    });
  }, [state.fees, state.students, search]);

  const totalCollected = state.fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const totalPending = state.fees.filter(f => f.status !== 'paid').reduce((s, f) => s + f.amount, 0);

  const openAdd = () => {
    const firstStudent = state.students[0];
    setForm({ ...BLANK, studentId: firstStudent?.id || 'S001', studentName: firstStudent?.name || '' });
    setModal('add');
  };
  const openEdit = (f: FeeRecord) => { setSelected(f); setForm({ ...f }); setModal('edit'); };

  const handleStudentChange = (studentId: string) => {
    const student = state.students.find(s => s.id === studentId);
    setForm(prev => ({ ...prev, studentId, studentName: student?.name || '' }));
  };

  const handleSave = () => {
    if (modal === 'add') addFee(form);
    else if (modal === 'edit' && selected) updateFee({ ...form, id: selected.id });
    setModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Management</h1>
          <p className="page-subtitle">Track payments and outstanding dues</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by student name, ID or fee type..." />
          <button className="btn-primary" onClick={openAdd}><Plus className="h-4 w-4" /> Add Fee Record</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Total Collected</p>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{formatCurrency(totalCollected)}</p>
          <p className="text-xs text-emerald-600 mt-1">{state.fees.filter(f=>f.status==='paid').length} payments</p>
        </div>
        <div className="card bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Pending</p>
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-300 mt-1">{formatCurrency(state.fees.filter(f=>f.status==='pending').reduce((s,f)=>s+f.amount,0))}</p>
          <p className="text-xs text-amber-600 mt-1">{state.fees.filter(f=>f.status==='pending').length} dues</p>
        </div>
        <div className="card bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Overdue</p>
          <p className="text-3xl font-bold text-rose-700 dark:text-rose-300 mt-1">{formatCurrency(state.fees.filter(f=>f.status==='overdue').reduce((s,f)=>s+f.amount,0))}</p>
          <p className="text-xs text-rose-600 mt-1">{state.fees.filter(f=>f.status==='overdue').length} overdue</p>
        </div>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Fee Type</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">No fee records found</td></tr>
              ) : filtered.map(f => {
                const student = state.students.find(s => s.id === f.studentId);
                return (
                  <tr key={f.id} className="table-row">
                    <td className="table-cell">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{student?.name || f.studentName || f.studentId}</p>
                      <p className="text-xs text-slate-400">{f.studentId} · {student?.rollNo}</p>
                    </td>
                    <td className="table-cell">{f.type}</td>
                    <td className="table-cell text-right font-semibold">{formatCurrency(f.amount)}</td>
                    <td className="table-cell">{formatDate(f.dueDate)}</td>
                    <td className="table-cell"><StatusBadge status={f.status} /></td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        {f.status !== 'paid' && (
                          <button title="Mark Paid" onClick={() => markFeeStatus(f.id, 'paid')} className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg text-emerald-600 transition-colors">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {f.status === 'paid' && (
                          <button title="Mark Pending" onClick={() => markFeeStatus(f.id, 'pending')} className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg text-amber-600 transition-colors">
                            <Clock className="h-4 w-4" />
                          </button>
                        )}
                        <button title="Mark Overdue" onClick={() => markFeeStatus(f.id, 'overdue')} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors">
                          <AlertTriangle className="h-4 w-4" />
                        </button>
                        <button title="Edit" onClick={() => openEdit(f)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><Pencil className="h-4 w-4 text-slate-500" /></button>
                        <button title="Delete" onClick={() => setConfirmDelete(f)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Fee Record' : 'Edit Fee Record'} size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={handleSave}>Save</button></>}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Student</label>
            <select className="input" value={form.studentId} onChange={e => handleStudentChange(e.target.value)}>
              {state.students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>)}
            </select>
          </div>
          <div><label className="label">Fee Type</label><input className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})} placeholder="e.g. Tuition Fee (Sem 4)" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Amount (₹)</label><input type="number" className="input" value={form.amount} onChange={e => setForm({...form, amount: +e.target.value})} /></div>
            <div><label className="label">Due Date</label><input type="date" className="input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value as 'paid'|'pending'|'overdue'})}>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Fee Record" message={`Delete this fee record (${confirmDelete?.type})?`} confirmLabel="Delete"
        onConfirm={() => { deleteFee(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}
