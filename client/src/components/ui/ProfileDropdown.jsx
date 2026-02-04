import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import AppImage from '../AppImage';
import { useAuth } from '../../context/AuthContext';

// Reusable link item for the dropdown
const DropdownLink = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-secondary hover:text-primary rounded-lg transition-colors"
  >
    <Icon name={icon} size={16} />
    <span>{label}</span>
  </Link>
);

// Reusable button item for the dropdown
const DropdownButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
  >
    <Icon name={icon} size={16} />
    <span>{label}</span>
  </button>
);

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const closeDropdown = () => setIsOpen(false);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(p => !p)}
        className={`w-9 h-9 rounded-full overflow-hidden focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all ${
          isOpen ? 'ring-2 ring-ring ring-offset-2' : 'ring-0'
        }`}
      >
        <AppImage 
          src={user?.avatar} 
          alt={user?.firstName || 'User'} 
          className="w-full h-full object-cover" 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-3 w-64 bg-white rounded-xl shadow-cinematic border border-border p-2 z-50"
          >
            {/* User Info Header */}
            <div className="flex items-center space-x-3 p-3 mb-2">
              <AppImage 
                src={user?.avatar} 
                alt={user?.firstName || 'User'} 
                className="w-10 h-10 object-cover rounded-full" 
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary truncate">
                  {isAdmin ? "Admin" : `${user?.firstName} ${user?.lastName}`}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            {/* Links */}
            <div className="border-t border-border pt-2 space-y-1">
              <DropdownLink 
                to={isAdmin ? "/admin-dashboard" : "/user-dashboard"} 
                icon="LayoutDashboard" 
                label="Dashboard" 
                onClick={closeDropdown}
              />
              {!isAdmin && (
                <>
                  <DropdownLink 
                    to="/user-dashboard" // TODO: Link to bookings tab
                    icon="Calendar" 
                    label="My Bookings" 
                    onClick={closeDropdown}
                  />
                  <DropdownLink 
                    to="/user-dashboard" // TODO: Link to settings tab
                    icon="Settings" 
                    label="Profile Settings" 
                    onClick={closeDropdown}
                  />
                </>
              )}
            </div>
            
            {/* Logout */}
            <div className="border-t border-border my-2" />
            <DropdownButton 
              icon="LogOut" 
              label="Sign Out" 
              onClick={handleLogout} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;