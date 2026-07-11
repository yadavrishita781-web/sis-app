import { DashboardCard } from '../../components/DashboardCard';
import { students, facultyList, departments, subjects, subjectAttendance, fees, notices } from '../../services/dummyData';
import { Users, GraduationCap, Building2, BookOpen, CalendarCheck, CreditCard, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const avgAttendance = Math.round(subjectAttendance.reduce((sum, a) => sum + a.percentage, 0) / subjectAttendance.length);
  const totalFeesPaid = fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-rose-100 mt-1 text-sm">System overview and key metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Students" value={students.length} icon={GraduationCap} colorClass="bg-blue-500" trend="Active" trendUp />
        <DashboardCard title="Total Faculty" value={facultyList.length} icon={Users} colorClass="bg-emerald-500" />
        <DashboardCard title="Departments" value={departments.length} icon={Building2} colorClass="bg-purple-500" />
        <DashboardCard title="Subjects" value={subjects.length} icon={BookOpen} colorClass="bg-amber-500" />
        
        <DashboardCard title="Avg Attendance" value={`${avgAttendance}%`} icon={CalendarCheck} colorClass="bg-indigo-500" />
        <DashboardCard title="Fees Collected" value={`₹${totalFeesPaid.toLocaleString('en-IN')}`} icon={CreditCard} colorClass="bg-teal-500" />
        <DashboardCard title="Active Notices" value={notices.length} icon={Activity} colorClass="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200">Recent Activity</h2>
            <Link to="/admin/reports" className="text-xs text-rose-600 hover:underline flex items-center gap-0.5">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-4">
            {[
              { text: 'New student registration completed', time: '10 mins ago', type: 'student' },
              { text: 'CS Department published timetable', time: '1 hour ago', type: 'academic' },
              { text: 'Fee payment of ₹45,000 received', time: '2 hours ago', type: 'finance' },
              { text: 'System backup completed', time: '5 hours ago', type: 'system' }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${activity.type === 'finance' ? 'bg-emerald-500' : activity.type === 'student' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{activity.text}</p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
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
            {departments.map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{d.name}</p>
                  <p className="text-xs text-slate-500">HOD: {d.hod}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{d.totalStudents} Students</p>
                  <p className="text-xs text-slate-500">{d.totalFaculty} Faculty</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
