import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-canvas text-muted text-sm">Loading...</div>;
  
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export const PublicRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-canvas text-muted text-sm">Loading...</div>;
  
  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
