import { useMockDB } from '../../context/MockDB';
import { useAuth } from '../../hooks/useAuth';
import { DashboardCard } from '../../components/DashboardCard';
import { StatusBadge } from '../../components/StatusBadge';
import { Clock, ClipboardList, Users, Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils';

export function FacultyDashboard() {
  const { state } = useMockDB();
  const { user } = useAuth();

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = state.timetable.filter(t => t.day === today && (t.facultyName === user?.name || t.facultyName === 'Dr. Ramesh Kumar'));
  const pendingReviews = state.submissions.filter(s => s.status === 'submitted').length;
  const myStudents = state.students.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ').pop()}! 👋</h1>
        <p className="text-emerald-200 mt-1 text-sm">Here's your teaching overview for today ({today}).</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard title="Today's Classes" value={todayClasses.length} icon={Clock} colorClass="bg-emerald-500" subtitle="Scheduled today" />
        <DashboardCard title="Pending Reviews" value={pendingReviews} icon={ClipboardList} colorClass="bg-amber-500" subtitle="Assignments to grade" />
        <DashboardCard title="My Students" value={myStudents} icon={Users} colorClass="bg-indigo-500" subtitle="Across all sections" />
        <DashboardCard title="Notices" value={state.notices.length} icon={Bell} colorClass="bg-violet-500" subtitle="Department wide" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" /> Today's Classes
            </h2>
            <Link to="/faculty/timetable" className="text-xs text-emerald-600 hover:underline flex items-center gap-0.5">View all <ChevronRight className="h-3 w-3" /></Link>
          </div>
          {todayClasses.length === 0 ? (
            <p className="text-slate-400 text-sm">No classes scheduled for {today}</p>
          ) : (
            <div className="space-y-3">
              {todayClasses.map(slot => (
                <div key={slot.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 w-24 flex-shrink-0">{slot.startTime} – {slot.endTime}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{slot.subjectName}</p>
                    <p className="text-xs text-slate-400">{slot.room}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-emerald-600" /> Pending Reviews
            </h2>
            <Link to="/faculty/assignments" className="text-xs text-emerald-600 hover:underline flex items-center gap-0.5">View all <ChevronRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-3">
            {state.submissions.filter(s => s.status === 'submitted').slice(0, 5).map(sub => {
              const assignment = state.assignments.find(a => a.id === sub.assignmentId);
              return (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{sub.studentName}</p>
                    <p className="text-xs text-slate-400">{assignment?.title} · {sub.fileName}</p>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
              );
            })}
            {pendingReviews === 0 && <p className="text-slate-400 text-sm">No pending reviews</p>}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-emerald-600" /> Recent Notices
        </h2>
        <div className="space-y-3">
          {state.notices.slice(0, 3).map(n => (
            <div key={n.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <StatusBadge status={n.priority} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatDate(n.publishedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
