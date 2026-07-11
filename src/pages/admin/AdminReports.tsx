import { FileText, Download } from 'lucide-react';

export function AdminReports() {
  const reports = [
    { title: 'Student Attendance Defaulters', desc: 'List of students with attendance < 75%', type: 'attendance' },
    { title: 'Semester Result Analysis', desc: 'Comprehensive academic performance report', type: 'academic' },
    { title: 'Fee Defaulters', desc: 'List of students with pending fees > 30 days', type: 'finance' },
    { title: 'Faculty Workload Report', desc: 'Assigned subjects and hours per faculty', type: 'administrative' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Reports</h1>
          <p className="page-subtitle">Generate and download administrative reports</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => (
          <div key={i} className="card flex items-start gap-4 hover:shadow-card-hover transition-shadow">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">{r.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{r.desc}</p>
              <button className="mt-3 text-sm text-indigo-600 hover:underline flex items-center gap-1 font-medium">
                <Download className="h-4 w-4" /> Download CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
