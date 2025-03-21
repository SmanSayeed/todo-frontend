// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import { Toaster } from 'react-hot-toast';

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
  const { isAuthenticated, getProfile } = useAuthStore();
  
  // Initialize auth state from localStorage on app startup
  useEffect(() => {
    const token = getAuthToken();
    
    // Only attempt to get profile if we have a token and aren't already authenticated
    if (token && !isAuthenticated) {
      // Set a loading state to prevent flashing of login screen
      getProfile().catch(error => {
        console.error('Failed to restore session:', error);
      });
    }
  }, [isAuthenticated, getProfile]);

  return (
    <>
      <Toaster position="top-right" />
      
      <Routes>
        {/* Protected Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
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