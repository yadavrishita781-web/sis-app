import { useQuery } from '@tanstack/react-query';
import { academicService } from '../../services/academicService';
import { studentService } from '../../services/studentService';
import { operationService } from '../../services/operationService';
import { useAuth } from '../../hooks/useAuth';
import { DashboardCard } from '../../components/DashboardCard';
import { StatusBadge } from '../../components/StatusBadge';
import { Clock, ClipboardList, Users, Bell, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils';

export function FacultyDashboard() {
  const { user } = useAuth();

  const { data: timetable = [], isLoading: loadingTimetable } = useQuery({
    queryKey: ['timetable'],
    queryFn: () => academicService.getTimetable()
  });

  const { data: students = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['adminStudents'],
    queryFn: () => studentService.getStudents()
  });

  const { data: notices = [], isLoading: loadingNotices } = useQuery({
    queryKey: ['notices'],
    queryFn: () => operationService.getNotices()
  });

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = timetable.filter((t: any) => t.day === today);
  const pendingReviews = 0;
  const myStudents = students.length;

  if (loadingTimetable || loadingStudents || loadingNotices) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ').pop() || user?.email}! 👋</h1>
        <p className="text-emerald-200 mt-1 text-sm">Here's your teaching overview for today ({today}).</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard title="Today's Classes" value={todayClasses.length} icon={Clock} colorClass="bg-emerald-500" subtitle="Scheduled today" />
        <DashboardCard title="Pending Reviews" value={pendingReviews} icon={ClipboardList} colorClass="bg-amber-500" subtitle="Assignments to grade" />
        <DashboardCard title="My Students" value={myStudents} icon={Users} colorClass="bg-indigo-500" subtitle="Across all sections" />
        <DashboardCard title="Notices" value={notices.length} icon={Bell} colorClass="bg-violet-500" subtitle="Department wide" />
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
              {todayClasses.map((slot: any) => (
                <div key={slot.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 w-24 flex-shrink-0">{slot.startTime || slot.start_time} – {slot.endTime || slot.end_time}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{slot.subjectName || slot.subject_name || slot.subjectId}</p>
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
            {pendingReviews === 0 && <p className="text-slate-400 text-sm">No pending reviews</p>}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-emerald-600" /> Recent Notices
        </h2>
        <div className="space-y-3">
          {notices.slice(0, 3).map((n: any) => (
            <div key={n.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <StatusBadge status={n.priority || 'info'} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatDate(n.publishedAt || n.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

