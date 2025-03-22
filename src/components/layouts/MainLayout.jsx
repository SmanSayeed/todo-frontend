import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Toast from '../ui/Toast';
import Loader from '../ui/Loader';
import { useAuthRedux } from '../../hooks/useAuthRedux';

const MainLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, getProfile, user } = useAuthRedux();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileError, setProfileError] = useState(false);
  
  useEffect(() => {
    // Only try to load profile if authenticated and not already loaded
    if (isAuthenticated && !profileLoaded && !user) {
      const loadProfile = async () => {
        try {
          await getProfile();
          setProfileLoaded(true);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          setProfileError(true);
          // Handle authentication error - redirect to login
          if (error.status === 401) {
            navigate('/login', { replace: true });
          }
        }
      };
      
      loadProfile();
    }
    
    // If we already have user data, consider the profile loaded
    if (user && !profileLoaded) {
      setProfileLoaded(true);
    }
  }, [isAuthenticated, profileLoaded, getProfile, user, navigate]);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Show loading indicator while waiting for profile data
  if (isLoading && !profileLoaded && !profileError) {
    return <Loader fullScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Toast /> */}
      
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