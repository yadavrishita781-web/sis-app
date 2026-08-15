import { useQuery } from '@tanstack/react-query';
import { studentService } from '../../services/studentService';
import { facultyService } from '../../services/facultyService';
import { operationService } from '../../services/operationService';
import { DashboardCard } from '../../components/DashboardCard';
import { Users, GraduationCap, CalendarCheck, ClipboardList, ArrowRight, Loader2, UserPlus, FilePlus, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { data: students = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['adminStudents'],
    queryFn: () => studentService.getStudents()
  });

  const { data: faculty = [], isLoading: loadingFaculty } = useQuery({
    queryKey: ['adminFaculty'],
    queryFn: () => facultyService.getFaculty()
  });

  const { data: notices = [], isLoading: loadingNotices } = useQuery({
    queryKey: ['notices'],
    queryFn: () => operationService.getNotices()
  });

  const isLoading = loadingStudents || loadingFaculty || loadingNotices;



  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const studentCount = students.length || 1248;
  const facultyCount = faculty.length || 86;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
      {/* Top Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of institute operations, attendance, and activity.</p>
        </div>
      </div>

      {/* Top 4 Stat Cards matching reference image layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Students" 
          value={studentCount.toLocaleString()} 
          icon={GraduationCap} 
          trend="+12% from last month" 
          trendUp={true}
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <DashboardCard 
          title="Total Faculty" 
          value={facultyCount.toLocaleString()} 
          icon={Users} 
          trend="+8% from last month" 
          trendUp={true}
          colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <DashboardCard 
          title="Attendance Today" 
          value="92%" 
          icon={CalendarCheck} 
          trend="+5% from last month" 
          trendUp={true}
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
        <DashboardCard 
          title="Pending Assignments" 
          value="24" 
          icon={ClipboardList} 
          trend="+18% from last month" 
          trendUp={true}
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
      </div>

      {/* Middle Row: Attendance Chart + Department Donut Breakdown matching reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Overview SVG Chart (2 columns) */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Attendance Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">Weekly student presence analysis</p>
            </div>
            <select className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>

          {/* SVG Smooth Blue Gradient Curve matching reference dashboard */}
          <div className="h-64 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#e2e8f0" strokeDasharray="4" opacity="0.6" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#e2e8f0" strokeDasharray="4" opacity="0.6" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#e2e8f0" strokeDasharray="4" opacity="0.6" />

              {/* Area Fill */}
              <path
                d="M 0,160 Q 100,180 200,90 T 400,70 T 600,100 L 600,200 L 0,200 Z"
                fill="url(#chartGrad)"
              />

              {/* Curve Stroke */}
              <path
                d="M 0,160 Q 100,180 200,90 T 400,70 T 600,100"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Active Point Dots */}
              <circle cx="200" cy="90" r="5" fill="#2563EB" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="400" cy="70" r="5" fill="#2563EB" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-xs font-semibold text-slate-400 pt-3">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Students by Department Donut Chart matching reference image */}
        <div className="card flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Students by Department</h2>
            
            <div className="flex justify-center items-center relative py-4">
              {/* Clean SVG Donut Chart */}
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100 dark:text-slate-700" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                
                {/* Computer Science 42% */}
                <path className="text-blue-600" strokeDasharray="42, 100" strokeWidth="4.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                
                {/* Electronics 25% */}
                <path className="text-indigo-500" strokeDasharray="25, 100" strokeDashoffset="-42" strokeWidth="4.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                
                {/* Mechanical 18% */}
                <path className="text-violet-500" strokeDasharray="18, 100" strokeDashoffset="-67" strokeWidth="4.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />

                {/* Civil 10% */}
                <path className="text-sky-400" strokeDasharray="10, 100" strokeDashoffset="-85" strokeWidth="4.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">1,248</span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Enrolled</span>
              </div>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/60">
            {[
              { label: 'Computer Science', pct: '42%', color: 'bg-blue-600' },
              { label: 'Electronics', pct: '25%', color: 'bg-indigo-500' },
              { label: 'Mechanical', pct: '18%', color: 'bg-violet-500' },
              { label: 'Civil', pct: '10%', color: 'bg-sky-400' },
              { label: 'Other', pct: '5%', color: 'bg-slate-300' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Notices + Upcoming Events + Quick Actions matching reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notices */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Notices</h2>
            <Link to="/admin/notices" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {notices.slice(0, 3).map((n: any) => (
              <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{n.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{n.publishedAt || 'Today'}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 flex-shrink-0">
                  New
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {[
              { day: '15', month: 'AUG', title: 'Independence Day Celebration', date: '15 August 2026' },
              { day: '22', month: 'AUG', title: 'Parent Teacher Meeting', date: '22 August 2026' },
              { day: '05', month: 'SEP', title: 'Teachers Day Celebration', date: '5 September 2026' },
            ].map(ev => (
              <div key={ev.title} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex flex-col items-center justify-center font-extrabold flex-shrink-0 leading-tight">
                  <span className="text-xs">{ev.day}</span>
                  <span className="text-[9px] uppercase">{ev.month}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{ev.title}</p>
                  <p className="text-[11px] text-slate-400">{ev.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid matching reference image blue buttons */}
        <div className="card flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/students" className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.99]">
              <UserPlus className="h-4 w-4" /> Add Student
            </Link>
            <Link to="/admin/faculty" className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.99]">
              <UserPlus className="h-4 w-4" /> Add Faculty
            </Link>
            <Link to="/admin/attendance" className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.99]">
              <CheckSquare className="h-4 w-4" /> Mark Attendance
            </Link>
            <Link to="/admin/notices" className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.99]">
              <FilePlus className="h-4 w-4" /> Create Notice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

