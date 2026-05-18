import { Link } from 'react-router-dom';
import { Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
import CommandSearch from './CommandSearch';
import { Dropdown } from './ui/Dropdown';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleMobile } = useSidebar();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CM';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-6 bg-canvas/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-lg text-muted hover:text-foreground hover:bg-elevated transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <CommandSearch className="flex-1 max-w-xl" />

        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
          <button
            type="button"
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-elevated transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent border-2 border-canvas" />
          </button>

          <Dropdown
            align="right"
            trigger={
              <span className="flex items-center gap-2 p-1.5 pr-2 rounded-lg hover:bg-elevated transition-colors border border-transparent hover:border-border">
                <span className="w-8 h-8 rounded-lg bg-accent-dim border border-[#2ea043] flex items-center justify-center text-xs font-semibold text-foreground">
                  {initials}
                </span>
                <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
                  {user?.name || 'Developer'}
                </span>
              </span>
            }
            items={[
              { label: 'Profile', icon: User, onClick: () => navigate('/profile') },
              { label: 'Settings', icon: Settings, onClick: () => navigate('/settings') },
              { divider: true },
              { label: 'Sign out', icon: LogOut, onClick: handleLogout, danger: true },
            ]}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
