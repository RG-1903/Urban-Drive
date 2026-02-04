import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const isHomepage = location.pathname === '/' || location.pathname === '/homepage';

  const isDarkText = isScrolled || !isHomepage;
  const shouldBeSolid = isScrolled || !isHomepage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'Vehicles', path: '/vehicle-search', icon: 'Car' },
    { name: 'Blog', path: '/blog', icon: 'BookOpen' },
    { name: 'Booking', path: '/booking-wizard', icon: 'Calendar', show: isAuthenticated },
    { name: 'Support', path: '/support', icon: 'HelpCircle' }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path || location?.pathname?.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const Logo = () => (
    <Link to="/homepage" className="flex items-center space-x-3 group">
      <div className="flex flex-col">
        <span className={`text-2xl font-medium font-accent tracking-tight transition-colors ${isDarkText ? 'text-primary' : 'text-white'}`}>
          UrbanDrive
        </span>
      </div>
    </Link>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${shouldBeSolid
          ? 'bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/20 supports-[backdrop-filter]:bg-white/60'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => {
              if (item.show === false) return null;

              return (
                <Link
                  key={item?.name}
                  to={item?.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActivePath(item?.path)
                      ? 'bg-accent text-accent-foreground shadow-premium'
                      : isDarkText
                        ? 'text-text-secondary hover:text-primary hover:bg-secondary'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              iconName="Search"
              iconPosition="left"
              className={!isDarkText ? 'text-white/80 hover:text-white hover:bg-white/10' : ''}
            >
              Search
            </Button>

            <Link to="/booking-wizard">
              <Button variant="default" size="sm" iconName="Plus" iconPosition="left">
                Book Now
              </Button>
            </Link>

            {!isAuthenticated ? (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="User"
                  iconPosition="left"
                  className={!isDarkText ? 'text-white/80 hover:text-white hover:bg-white/10 border-white/30' : ''}
                >
                  Sign In
                </Button>
              </Link>
            ) : (
              <ProfileDropdown />
            )}
          </div>

          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              iconName={isMobileMenuOpen ? "X" : "Menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={!isDarkText ? 'text-white/80 hover:text-white hover:bg-white/10' : ''}
            />
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-cinematic ${shouldBeSolid ? 'bg-white/95 backdrop-blur-premium' : 'bg-white'
              }`}
          >
            <div className="px-4 py-6 space-y-4">
              <nav className="space-y-2">
                {navigationItems?.map((item) => {
                  if (item.show === false) return null;

                  return (
                    <Link
                      key={item?.name}
                      to={item?.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${isActivePath(item?.path)
                          ? 'bg-accent text-accent-foreground'
                          : 'text-text-secondary hover:text-primary hover:bg-secondary'
                        }`}
                    >
                      <Icon name={item?.icon} size={20} />
                      <span>{item?.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-border space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  iconName="Search"
                  iconPosition="left"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Search Vehicles
                </Button>

                {!isAuthenticated ? (
                  <Link to="/login" className="w-full">
                    <Button
                      variant="ghost"
                      fullWidth
                      iconName="User"
                      iconPosition="left"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to={isAdmin ? "/admin-dashboard" : "/user-dashboard"} className="w-full">
                      <Button
                        variant="ghost"
                        fullWidth
                        iconName="LayoutDashboard"
                        iconPosition="left"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Button>
                    </Link>
                    {!isAdmin && (
                      <Link to="/user-dashboard" className="w-full">
                        <Button
                          variant="ghost"
                          fullWidth
                          iconName="Calendar"
                          iconPosition="left"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          My Bookings
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      fullWidth
                      iconName="LogOut"
                      iconPosition="left"
                      onClick={handleLogout}
                      className="text-destructive"
                    >
                      Sign Out
                    </Button>
                  </>
                )}

                <Link to="/booking-wizard" className="w-full">
                  <Button
                    variant="default"
                    fullWidth
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;