import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';

const Logo = () => (
  <Link to="/admin" className="flex items-center space-x-3 group px-3">
    {/* <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-premium">
      <Icon name="Car" size={20} color="white" strokeWidth={2.5} />
    </div> */}
    <div className="flex flex-col">
      <span className="text-2xl font-medium text-primary font-accent tracking-tight">
        UrbanDrive
      </span>
      <span className="text-xs font-medium text-accent tracking-wider uppercase">
        Admin
      </span>
    </div>
  </Link>
);

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
    { name: 'Vehicles', path: '/admin/vehicles', icon: 'Car' },
    { name: 'Categories', path: '/admin/categories', icon: 'Tags' }, // Add Categories
    { name: 'Loyalty', path: '/admin/loyalty', icon: 'Crown' },
    { name: 'Bookings', path: '/admin/bookings', icon: 'Calendar' },
    { name: 'Users', path: '/admin/users', icon: 'Users' },
    // { name: 'Locations', path: '/admin/locations', icon: 'MapPin' }, // FIXED: Removed
    { name: 'Reviews', path: '/admin/reviews', icon: 'Star' },
    { name: 'Blog', path: '/admin/blog', icon: 'BookOpen' },
    { name: 'Messages', path: '/admin/contact', icon: 'MessageSquare' },
  ];

  const bottomItems = [
    { name: 'Settings', path: '/admin/settings', icon: 'Settings' },
    { name: 'View Site', path: '/', icon: 'Globe' },
  ];

  const isActivePath = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === path || location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ item }) => (
    <Link
      to={item.path}
      target={item.name === 'View Site' ? '_blank' : ''}
      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${isActivePath(item.path)
        ? 'bg-accent text-accent-foreground shadow-premium'
        : 'text-text-secondary hover:text-primary hover:bg-secondary'
        }`}
    >
      <Icon name={item.icon} size={18} />
      <span>{item.name}</span>
    </Link>
  );

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-border flex flex-col z-50">
      <div className="p-4 py-5 border-b border-border">
        <Logo />
      </div>

      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
        <Button
          variant="outline"
          size="sm"
          iconName="LogOut"
          iconPosition="left"
          fullWidth
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;