import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';

interface ProtectedRouteProps {
  allowedRole: Role;
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== allowedRole) {
    // redirect to their own dashboard
    return <Navigate to={`/${user?.role}`} replace />;
  }
  return <Outlet />;
}
