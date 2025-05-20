import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { UserRole } from '../types';
import dawka from "@/assets/dawka.jpg"
import damme from "@/assets/dammmee.jpg"

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  clearError: () => void;
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll simulate a login with mock data
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Check credentials (this is just for demo purposes)
          if (email === 'admin@bridge.com' && password === 'password') {
            const user: User = {
              id: '1',
              name: 'Damir',
              email: 'admin@bridge.com',
              role: UserRole.ADMIN,
              avatar: damme,
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else if (email === 'agent@bridge.com' && password === 'password') {
            const user: User = {
              id: '2',
              name: 'Dawlet',
              email: 'agent@bridge.com',
              role: UserRole.AGENT,
              avatar: dawka,
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ 
              isLoading: false, 
              error: 'Invalid email or password' 
            });
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred during login' 
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (name, email, password, role) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll simulate registration with mock data
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Simulate successful registration
          const user: User = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            email,
            role,
          };
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred during registration' 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'bridge-auth-storage', // Name for localStorage
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
