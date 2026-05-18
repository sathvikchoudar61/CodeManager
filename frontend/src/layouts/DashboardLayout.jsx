import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
import { SkeletonCard } from '../components/ui/Skeleton';

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const { collapsed } = useSidebar();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          <SkeletonCard />
          <p className="text-center text-sm text-muted">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-canvas flex">
      <Sidebar />

      <div
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}
        `}
      >
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 overflow-y-auto custom-scrollbar">
          <Navbar />
          <div key={location.pathname} className="animate-fade-in max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
