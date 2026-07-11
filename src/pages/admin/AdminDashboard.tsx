import { useMockDB } from '../../context/MockDB';
import { DashboardCard } from '../../components/DashboardCard';
import { Users, GraduationCap, Building2, BookOpen, CalendarCheck, CreditCard, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { state } = useMockDB();

  const avgAttendance = state.subjectAttendance.length > 0
    ? Math.round(state.subjectAttendance.reduce((s, a) => s + a.percentage, 0) / state.subjectAttendance.length)
    : 0;
  const totalFeesPaid = state.fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const pendingFees = state.fees.filter(f => f.status !== 'paid').reduce((s, f) => s + f.amount, 0);
  const pendingAssignments = state.assignments.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-rose-100 mt-1 text-sm">System overview and key metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Students" value={state.students.length} icon={GraduationCap} colorClass="bg-blue-500" trend="Active" trendUp />
        <DashboardCard title="Total Faculty" value={state.faculty.length} icon={Users} colorClass="bg-emerald-500" />
        <DashboardCard title="Departments" value={state.departments.length} icon={Building2} colorClass="bg-purple-500" />
        <DashboardCard title="Subjects" value={state.subjects.length} icon={BookOpen} colorClass="bg-amber-500" />
        <DashboardCard title="Avg Attendance" value={`${avgAttendance}%`} icon={CalendarCheck} colorClass="bg-indigo-500" />
        <DashboardCard title="Fees Collected" value={`₹${totalFeesPaid.toLocaleString('en-IN')}`} icon={CreditCard} colorClass="bg-teal-500" />
        <DashboardCard title="Pending Dues" value={`₹${pendingFees.toLocaleString('en-IN')}`} icon={CreditCard} colorClass="bg-rose-500" />
        <DashboardCard title="Active Notices" value={state.notices.length} icon={Activity} colorClass="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200">Recent Notices</h2>
            <Link to="/admin/notices" className="text-xs text-rose-600 hover:underline flex items-center gap-0.5">Manage <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-3">
            {state.notices.slice(0, 4).map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.priority === 'high' ? 'bg-red-500' : n.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{n.title}</p>
                  <p className="text-xs text-slate-400">{n.publishedBy} · {n.publishedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200">Department Overview</h2>
            <Link to="/admin/departments" className="text-xs text-rose-600 hover:underline flex items-center gap-0.5">Manage <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-3">
            {state.departments.map(d => {
              const studs = state.students.filter(s => s.department === d.name).length;
              const facs = state.faculty.filter(f => f.department === d.name).length;
              return (
                <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{d.name}</p>
                    <p className="text-xs text-slate-500">HOD: {d.hod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{studs} Students</p>
                    <p className="text-xs text-slate-500">{facs} Faculty</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Fee Collection Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">Collected</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">₹{totalFeesPaid.toLocaleString('en-IN')}</p>
            <p className="text-xs text-emerald-600 mt-1">{state.fees.filter(f => f.status === 'paid').length} payments</p>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-400">Pending</p>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">₹{state.fees.filter(f=>f.status==='pending').reduce((s,f)=>s+f.amount,0).toLocaleString('en-IN')}</p>
            <p className="text-xs text-amber-600 mt-1">{state.fees.filter(f => f.status === 'pending').length} dues</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-400">Overdue</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">₹{state.fees.filter(f=>f.status==='overdue').reduce((s,f)=>s+f.amount,0).toLocaleString('en-IN')}</p>
            <p className="text-xs text-red-600 mt-1">{state.fees.filter(f => f.status === 'overdue').length} overdue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
