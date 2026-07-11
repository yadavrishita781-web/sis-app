import { useState } from 'react';
import { fees } from '../../services/dummyData';
import { SearchBar } from '../../components/SearchBar';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils';

export function AdminFees() {
  const [search, setSearch] = useState('');
  const filtered = fees.filter(f => f.studentId.toLowerCase().includes(search.toLowerCase()) || f.type.toLowerCase().includes(search.toLowerCase()));

  const totalCollected = fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const totalPending = fees.filter(f => f.status !== 'paid').reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Management</h1>
          <p className="page-subtitle">Track payments and outstanding dues</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student ID or type..." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Total Collected</p>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{formatCurrency(totalCollected)}</p>
        </div>
        <div className="card bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Outstanding Dues</p>
          <p className="text-3xl font-bold text-rose-700 dark:text-rose-300 mt-1">{formatCurrency(totalPending)}</p>
        </div>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Fee Type</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(f => (
                <tr key={f.id} className="table-row">
                  <td className="table-cell font-mono">{f.studentId}</td>
                  <td className="table-cell">{f.type}</td>
                  <td className="table-cell text-right font-semibold">{formatCurrency(f.amount)}</td>
                  <td className="table-cell">{formatDate(f.dueDate)}</td>
                  <td className="table-cell"><StatusBadge status={f.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
