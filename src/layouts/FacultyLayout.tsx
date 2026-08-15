import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarCheck, ClipboardList,
  FolderOpen, BarChart2, Clock, Calendar, Settings
} from 'lucide-react';
import { Sidebar, NavItem } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

const navItems: NavItem[] = [
  { label: 'Dashboard',      href: '/faculty',               icon: LayoutDashboard },
  { label: 'Students',       href: '/faculty/students',      icon: Users },
  { label: 'Attendance',     href: '/faculty/attendance',    icon: CalendarCheck },
  { label: 'Assignments',    href: '/faculty/assignments',   icon: ClipboardList },
  { label: 'Study Material', href: '/faculty/materials',     icon: FolderOpen },
  { label: 'Marks',          href: '/faculty/marks',         icon: BarChart2 },
  { label: 'Timetable',      href: '/faculty/timetable',     icon: Clock },
  { label: 'Leave',          href: '/faculty/leave',         icon: Calendar },
  { label: 'Settings',       href: '/faculty/settings',      icon: Settings },
];

export function FacultyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-[#0B1329] overflow-hidden">
      <Sidebar items={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="faculty" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC] dark:bg-slate-900 lg:rounded-l-[2.5rem] shadow-2xl relative border-l border-slate-800/40">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

