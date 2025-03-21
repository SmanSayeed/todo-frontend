// src/components/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Toast from '../ui/Toast';
import Loader from '../ui/Loader';
import { useAuthStore } from '../../hooks/useAuth';

const MainLayout = () => {
  const { isAuthenticated, isLoading, getProfile } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated && !profileLoaded) {
      getProfile().then(() => setProfileLoaded(true));
    }
  }, [isAuthenticated, profileLoaded, getProfile]);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isLoading && !profileLoaded) {
    return <Loader fullScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Toast />
      
      <Navbar 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
        />
        
        <main className="flex-1 p-6 lg:px-8">
          <div className="mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;





