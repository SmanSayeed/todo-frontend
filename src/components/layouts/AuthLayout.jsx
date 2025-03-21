// src/components/layouts/AuthLayout.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Toast from '../ui/Toast';
import { useAuthStore } from '../../hooks/useAuth';

const AuthLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Toast />
      <Outlet />
    </div>
  );
};

export default AuthLayout;