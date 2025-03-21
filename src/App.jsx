import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import toast, { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Home from './components/pages/Home/Home';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';

// Auth Store
import { useAuthStore } from './hooks/useAuth';
import { getAuthToken } from './utils/auth';

function App() {
  const { token, isAuthenticated, getProfile } = useAuthStore();
  
  // Initialize auth state from localStorage on app startup
  useEffect(() => {
    const storedToken = getAuthToken();
    
    if (storedToken && !token && !isAuthenticated) {
      getProfile().catch(error => {
        console.error('Failed to get user profile', error);
        toast.error('Session expired. Please login again.');
      });
    }
  }, [token, isAuthenticated, getProfile]);

  return (
    <>
      <Toaster position="top-right" />
      
      <Routes>
        {/* Protected Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          {/* Add more protected routes here */}
        </Route>
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;