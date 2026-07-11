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
    <div className="flex h-screen bg-theme-sidebar overflow-hidden">
      <Sidebar items={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="faculty" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-theme-bg rounded-l-[2rem] shadow-2xl relative">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
