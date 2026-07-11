import { useMockDB } from '../../context/MockDB';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils';
import { Receipt } from 'lucide-react';

export function StudentFees() {
  const { state } = useMockDB();
  const { user } = useAuth();

  const studentId = user?.id || 'S001';
  const fees = state.fees.filter(f => f.studentId === studentId);

  const paid = fees.filter(f => f.status === 'paid');
  const pending = fees.filter(f => f.status !== 'paid');
  const totalPaid = paid.reduce((s, f) => s + f.amount, 0);
  const totalDue = pending.reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Management</h1>
          <p className="page-subtitle">View your fee details and payment receipts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Total Paid</p>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">{paid.length} transactions</p>
        </div>
        <div className="card bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Amount Due</p>
          <p className="text-3xl font-bold text-rose-700 dark:text-rose-300 mt-1">{formatCurrency(totalDue)}</p>
          <p className="text-xs text-rose-600 dark:text-rose-500 mt-1">{pending.length} pending payments</p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">All Fee Records</h2>
        <div className="table-wrapper">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Fee Type</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Paid Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {fees.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">No fee records</td></tr>
              ) : fees.map(f => (
                <tr key={f.id} className="table-row">
                  <td className="table-cell font-medium">{f.type}</td>
                  <td className="table-cell text-right font-semibold">{formatCurrency(f.amount)}</td>
                  <td className="table-cell">{formatDate(f.dueDate)}</td>
                  <td className="table-cell">{f.paidDate ? formatDate(f.paidDate) : '–'}</td>
                  <td className="table-cell"><StatusBadge status={f.status} /></td>
                  <td className="table-cell">
                    {f.receiptNo ? (
                      <button className="flex items-center gap-1 text-indigo-600 hover:underline text-sm">
                        <Receipt className="h-3.5 w-3.5" /> {f.receiptNo}
                      </button>
                    ) : '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
