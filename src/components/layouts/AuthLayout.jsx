import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Toast from '../ui/Toast';
import { useAuthRedux } from '../../hooks/useAuthRedux';

const AuthLayout = () => {
  const { isAuthenticated } = useAuthRedux();
  
  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Toast /> */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;