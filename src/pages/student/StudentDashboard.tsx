import {
  CalendarCheck, ClipboardList, CreditCard, Bell,
  TrendingUp, Clock, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DashboardCard } from '../../components/DashboardCard';
import { StatusBadge } from '../../components/StatusBadge';
import {
  subjectAttendance, assignments, fees, notices, timetable
} from '../../services/dummyData';
import { formatDate, getAttendanceColor } from '../../utils';

export function StudentDashboard() {
  const { user } = useAuth();
  const overallPct = Math.round(subjectAttendance.reduce((s, a) => s + a.percentage, 0) / subjectAttendance.length);
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const pendingFees = fees.filter(f => f.status !== 'paid').reduce((s, f) => s + f.amount, 0);
  const todaySlots = timetable.filter(t => t.day === 'Monday');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Good morning, {user?.name.split(' ')[0]}! 👋</h1>
        <p className="text-indigo-200 mt-1 text-sm">Here's what's happening with your academics today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard
          title="Overall Attendance"
          value={`${overallPct}%`}
          icon={CalendarCheck}
          colorClass={overallPct >= 75 ? 'bg-emerald-500' : 'bg-red-500'}
          subtitle={overallPct >= 75 ? 'Good standing' : 'Below threshold!'}
        />
        <DashboardCard
          title="Pending Assignments"
          value={pendingAssignments}
          icon={ClipboardList}
          colorClass="bg-amber-500"
          subtitle="Due soon"
        />
        <DashboardCard
          title="Fees Due"
          value={`₹${pendingFees.toLocaleString('en-IN')}`}
          icon={CreditCard}
          colorClass="bg-rose-500"
          subtitle="Pay before due date"
        />
        <DashboardCard
          title="Notices"
          value={notices.length}
          icon={Bell}
          colorClass="bg-blue-500"
          subtitle="New updates"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <div className="card lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600" /> Today's Classes
            </h2>
            <Link to="/student/timetable" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {todaySlots.length === 0 ? (
            <p className="text-slate-400 text-sm">No classes today</p>
          ) : (
            <div className="space-y-3">
              {todaySlots.map(slot => (
                <div key={slot.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 w-20 flex-shrink-0">
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{slot.subjectName}</p>
                    <p className="text-xs text-slate-400">{slot.room}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attendance Overview */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" /> Attendance Overview
            </h2>
            <Link to="/student/attendance" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
              Details <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {subjectAttendance.map(sa => (
              <div key={sa.subjectId}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{sa.subjectName}</span>
                  <span className={`font-semibold ${getAttendanceColor(sa.percentage)}`}>{sa.percentage}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${sa.percentage >= 85 ? 'bg-emerald-500' : sa.percentage >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${sa.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Assignments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-indigo-600" /> Pending Assignments
            </h2>
            <Link to="/student/assignments" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {assignments.filter(a => a.status === 'pending').slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.subjectName} · Due: {formatDate(a.dueDate)}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-600" /> Recent Notices
            </h2>
            <Link to="/student/notices" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {notices.slice(0, 3).map(n => (
              <div key={n.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
                  <StatusBadge status={n.priority} className="flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-400 mt-1">{formatDate(n.publishedAt)} · {n.publishedBy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
