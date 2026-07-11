import { useMockDB } from '../../context/MockDB';
import { FileText, Download } from 'lucide-react';

export function AdminReports() {
  const { state } = useMockDB();

  const attendance75 = state.subjectAttendance.filter(a => a.percentage < 75);
  const feeDefaulters = state.fees.filter(f => f.status !== 'paid');
  const unpublishedSubjects = state.subjects.filter(s => !state.publishedSubjects.includes(s.id));

  const generateCSV = (headers: string[], rows: string[][]): void => {
    const content = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reports = [
    {
      title: 'Student Attendance Defaulters',
      desc: `${attendance75.length} subjects below 75%`,
      type: 'attendance',
      count: attendance75.length,
      download: () => generateCSV(
        ['Subject ID', 'Subject Name', 'Total Classes', 'Present', 'Percentage'],
        attendance75.map(a => [a.subjectId, a.subjectName, String(a.total), String(a.present), `${a.percentage}%`])
      ),
    },
    {
      title: 'Fee Defaulters',
      desc: `${feeDefaulters.length} pending/overdue payments`,
      type: 'finance',
      count: feeDefaulters.length,
      download: () => generateCSV(
        ['Student ID', 'Fee Type', 'Amount', 'Status', 'Due Date'],
        feeDefaulters.map(f => [f.studentId, f.type, `₹${f.amount}`, f.status, f.dueDate])
      ),
    },
    {
      title: 'All Students List',
      desc: `${state.students.length} students enrolled`,
      type: 'academic',
      count: state.students.length,
      download: () => generateCSV(
        ['Name', 'Roll No', 'Department', 'Semester', 'Email', 'Phone'],
        state.students.map(s => [s.name, s.rollNo, s.department, String(s.semester), s.email, s.phone])
      ),
    },
    {
      title: 'Faculty Workload Report',
      desc: `${state.faculty.length} faculty members`,
      type: 'administrative',
      count: state.faculty.length,
      download: () => generateCSV(
        ['Name', 'Department', 'Designation', 'Experience', 'Subjects'],
        state.faculty.map(f => [f.name, f.department, f.designation, f.experience, f.subjects.join('; ')])
      ),
    },
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
          <div key={i} className="card flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">{r.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{r.desc}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-2xl font-bold text-indigo-600">{r.count}</span>
                <button onClick={r.download} className="text-sm text-indigo-600 hover:underline flex items-center gap-1 font-medium">
                  <Download className="h-4 w-4" /> Download CSV
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
