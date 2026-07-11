import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, BookOpen, Clock,
  ClipboardList, FolderOpen, BarChart2, CreditCard,
  Bell, Calendar, UserCircle
} from 'lucide-react';
import { Sidebar, NavItem } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

const navItems: NavItem[] = [
  { label: 'Dashboard',      href: '/student',              icon: LayoutDashboard },
  { label: 'Attendance',     href: '/student/attendance',   icon: CalendarCheck },
  { label: 'Subjects',       href: '/student/subjects',     icon: BookOpen },
  { label: 'Timetable',      href: '/student/timetable',    icon: Clock },
  { label: 'Assignments',    href: '/student/assignments',  icon: ClipboardList },
  { label: 'Study Material', href: '/student/materials',    icon: FolderOpen },
  { label: 'Results',        href: '/student/results',      icon: BarChart2 },
  { label: 'Fees',           href: '/student/fees',         icon: CreditCard },
  { label: 'Notices',        href: '/student/notices',      icon: Bell },
  { label: 'Leave',          href: '/student/leave',        icon: Calendar },
  { label: 'Profile',        href: '/student/profile',      icon: UserCircle },
];

export function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar items={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="student" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
