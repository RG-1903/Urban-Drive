import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './AppIcon';

const ProtectedRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (isAuthenticated && !isAdmin) {
    return <Outlet />;
  }
  
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (isAuthenticated && isAdmin) {
    return <Outlet />;
  }
  
  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/user-dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;