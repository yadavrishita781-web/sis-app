import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Agentation } from 'agentation';

// Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { FacultyLayout } from './layouts/FacultyLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Pages
import { Login } from './pages/Login';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentSubjects } from './pages/student/StudentSubjects';
import { StudentTimetable } from './pages/student/StudentTimetable';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentMaterials } from './pages/student/StudentMaterials';
import { StudentResults } from './pages/student/StudentResults';
import { StudentFees } from './pages/student/StudentFees';
import { StudentNotices } from './pages/student/StudentNotices';
import { StudentLeave } from './pages/student/StudentLeave';
import { StudentProfile } from './pages/student/StudentProfile';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyStudents } from './pages/faculty/FacultyStudents';
import { FacultyAttendance } from './pages/faculty/FacultyAttendance';
import { FacultyAssignments } from './pages/faculty/FacultyAssignments';
import { FacultyMaterials } from './pages/faculty/FacultyMaterials';
import { FacultyMarks } from './pages/faculty/FacultyMarks';
import { FacultyTimetable } from './pages/faculty/FacultyTimetable';
import { FacultyLeave } from './pages/faculty/FacultyLeave';
import { FacultySettings } from './pages/faculty/FacultySettings';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminFaculty } from './pages/admin/AdminFaculty';
import { AdminDepartments } from './pages/admin/AdminDepartments';
import { AdminSubjects } from './pages/admin/AdminSubjects';
import { AdminTimetable } from './pages/admin/AdminTimetable';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminAssignments } from './pages/admin/AdminAssignments';
import { AdminResults } from './pages/admin/AdminResults';
import { AdminFees } from './pages/admin/AdminFees';
import { AdminNotices } from './pages/admin/AdminNotices';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute allowedRole="student" />}>
              <Route element={<StudentLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="attendance" element={<StudentAttendance />} />
                <Route path="subjects" element={<StudentSubjects />} />
                <Route path="timetable" element={<StudentTimetable />} />
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="materials" element={<StudentMaterials />} />
                <Route path="results" element={<StudentResults />} />
                <Route path="fees" element={<StudentFees />} />
                <Route path="notices" element={<StudentNotices />} />
                <Route path="leave" element={<StudentLeave />} />
                <Route path="profile" element={<StudentProfile />} />
              </Route>
            </Route>

            {/* Faculty Routes */}
            <Route path="/faculty" element={<ProtectedRoute allowedRole="faculty" />}>
              <Route element={<FacultyLayout />}>
                <Route index element={<FacultyDashboard />} />
                <Route path="students" element={<FacultyStudents />} />
                <Route path="attendance" element={<FacultyAttendance />} />
                <Route path="assignments" element={<FacultyAssignments />} />
                <Route path="materials" element={<FacultyMaterials />} />
                <Route path="marks" element={<FacultyMarks />} />
                <Route path="timetable" element={<FacultyTimetable />} />
                <Route path="leave" element={<FacultyLeave />} />
                <Route path="settings" element={<FacultySettings />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRole="admin" />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="faculty" element={<AdminFaculty />} />
                <Route path="departments" element={<AdminDepartments />} />
                <Route path="subjects" element={<AdminSubjects />} />
                <Route path="timetable" element={<AdminTimetable />} />
                <Route path="attendance" element={<AdminAttendance />} />
                <Route path="assignments" element={<AdminAssignments />} />
                <Route path="results" element={<AdminResults />} />
                <Route path="fees" element={<AdminFees />} />
                <Route path="notices" element={<AdminNotices />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          {import.meta.env.DEV && <Agentation />}
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

