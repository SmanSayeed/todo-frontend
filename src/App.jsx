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

// Redux Auth Hook
import { useAuthRedux } from './hooks/useAuthRedux';

function App() {
  const { isAuthenticated, loadToken } = useAuthRedux();
  
  // Initialize auth state from localStorage on app startup
  useEffect(() => {
    loadToken();
  }, [loadToken]);

  return (
    <>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
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