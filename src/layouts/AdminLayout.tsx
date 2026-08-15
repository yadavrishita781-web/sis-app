import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, Building2,
  BookOpen, Clock, CalendarCheck, ClipboardList,
  BarChart2, CreditCard, Bell, FileText, Settings
} from 'lucide-react';
import { Sidebar, NavItem } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

const navItems: NavItem[] = [
  { label: 'Dashboard',       href: '/admin',                   icon: LayoutDashboard },
  { label: 'Students',        href: '/admin/students',          icon: GraduationCap },
  { label: 'Faculty',         href: '/admin/faculty',           icon: Users },
  { label: 'Departments',     href: '/admin/departments',       icon: Building2 },
  { label: 'Subjects',        href: '/admin/subjects',          icon: BookOpen },
  { label: 'Timetable',       href: '/admin/timetable',         icon: Clock },
  { label: 'Attendance',      href: '/admin/attendance',        icon: CalendarCheck },
  { label: 'Assignments',     href: '/admin/assignments',       icon: ClipboardList },
  { label: 'Results',         href: '/admin/results',           icon: BarChart2 },
  { label: 'Fees',            href: '/admin/fees',              icon: CreditCard },
  { label: 'Notices',         href: '/admin/notices',           icon: Bell },
  { label: 'Reports',         href: '/admin/reports',           icon: FileText },
  { label: 'Settings',        href: '/admin/settings',          icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-[#0B1329] overflow-hidden">
      <Sidebar items={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="admin" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC] dark:bg-slate-900 lg:rounded-l-[2.5rem] shadow-2xl relative border-l border-slate-800/40">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

