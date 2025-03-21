// src/hooks/useAuth.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../api/authService';
import { setAuthToken } from '../utils/auth';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          
          if (response.success && response.data.access_token) {
            setAuthToken(response.data.access_token);
            
            set({
              user: response.data.user,
              token: response.data.access_token,
              isAuthenticated: true,
              isLoading: false
            });
          }
          return response;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          
          if (response.success && response.data.access_token) {
            setAuthToken(response.data.access_token);
            
            set({
              user: response.data.user,
              token: response.data.access_token,
              isAuthenticated: true,
              isLoading: false
            });
          }
          return response;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          setAuthToken(null);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },
      
      getProfile: async () => {
        const state = get();
        if (!state.token) return null;
        
        set({ isLoading: true, error: null });
        try {
          const response = await authService.getProfile();
          
          if (response.success && response.data) {
            set({ 
              user: response.data,
              isAuthenticated: true, 
              isLoading: false 
            });
            return response.data;
          }
          
          return null;
        } catch (error) {
          // If we get an authentication error, clear the state
          if (error.status === 401) {
            setAuthToken(null);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Authentication failed'
            });
          } else {
            set({ 
              error: error.message, 
              isLoading: false 
            });
          }
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);