import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  Trophy,
  UserCircle,
  LogOut,
  Terminal,
  FileCode2,
  Settings,
  PanelLeftClose,
  PanelLeft,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';

const SidebarItem = ({ icon: Icon, text, to, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      title={collapsed ? text : undefined}
      className={`
        flex items-center gap-3 rounded-lg transition-all duration-200
        ${collapsed ? 'justify-center px-2 py-2.5 mx-2' : 'px-3 py-2 mx-3'}
        ${isActive
          ? 'bg-elevated text-foreground font-medium border border-border'
          : 'text-muted hover:bg-elevated/60 hover:text-foreground border border-transparent'
        }
      `}
    >
      <Icon size={18} className={isActive ? 'text-accent' : 'text-muted'} />
      {!collapsed && <span className="text-sm truncate">{text}</span>}
    </Link>
  );
};

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { collapsed, toggle, mobileOpen, closeMobile } = useSidebar();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const content = (
  <>
      <div className={`flex items-center border-b border-border shrink-0 ${collapsed ? 'p-4 justify-center' : 'p-5 gap-3'}`}>
        <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0">
          <Terminal size={18} className="text-accent" />
        </div>
        {!collapsed && (
          <h1 className="text-base font-bold tracking-tight text-foreground truncate">
            Code<span className="text-accent">Manager</span>
          </h1>
        )}
        <button
          type="button"
          onClick={closeMobile}
          className="ml-auto lg:hidden p-1.5 text-muted hover:text-foreground"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex flex-col flex-1 py-4 overflow-y-auto custom-scrollbar">
        {!collapsed && (
          <p className="px-6 text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
            Menu
          </p>
        )}
        <div className="space-y-0.5">
          <SidebarItem icon={LayoutDashboard} text="Dashboard" to="/dashboard" collapsed={collapsed} />
          <SidebarItem icon={FileCode2} text="Problem of the Day" to="/potd" collapsed={collapsed} />
          <SidebarItem icon={Code2} text="Compiler" to="/compiler" collapsed={collapsed} />
          <SidebarItem icon={Trophy} text="Contests" to="/contests" collapsed={collapsed} />
        </div>

        {!collapsed && (
          <p className="px-6 text-[11px] font-semibold text-muted uppercase tracking-wider mt-8 mb-2">
            Account
          </p>
        )}
        {collapsed && <div className="h-px bg-border mx-3 my-4" />}
        <div className="space-y-0.5">
          <SidebarItem icon={UserCircle} text="Profile" to="/profile" collapsed={collapsed} />
          <SidebarItem icon={Settings} text="Settings" to="/settings" collapsed={collapsed} />
        </div>
      </nav>

      <div className={`border-t border-border shrink-0 ${collapsed ? 'p-2' : 'p-3'}`}>
        <button
          type="button"
          onClick={toggle}
          className={`
            hidden lg:flex items-center gap-2 w-full rounded-lg text-muted
            hover:bg-elevated hover:text-foreground transition-colors duration-200 mb-2
            ${collapsed ? 'justify-center p-2' : 'px-3 py-2 text-sm'}
          `}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft size={18} /> : <><PanelLeftClose size={18} /> <span>Collapse</span></>}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className={`
            flex items-center gap-3 w-full rounded-lg text-muted
            hover:bg-danger/10 hover:text-danger transition-colors duration-200
            ${collapsed ? 'justify-center p-2' : 'px-3 py-2'}
          `}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
  </>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-canvas/80 z-40 lg:hidden"
          onClick={closeMobile}
          aria-label="Close overlay"
        />
      )}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen bg-surface border-r border-border
          flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {content}
      </aside>
    </>
  );
};

export default Sidebar;
