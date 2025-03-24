'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// No router import needed
import { User, JwtToken } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: JwtToken, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user data on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window === 'undefined') return;
        
        const token = localStorage.getItem('jwt_token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          // Ensure cookie is also set for middleware
          document.cookie = `jwt_token=${token}; path=/; max-age=86400; SameSite=Strict`;
          setUser(JSON.parse(savedUser));
        } else {
          // If token is missing from localStorage but present in cookies, clear cookie
          const cookieExists = document.cookie.split(';').some(c => c.trim().startsWith('jwt_token='));
          if (cookieExists) {
            document.cookie = 'jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        document.cookie = 'jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login: Store user data and token
  const login = (tokenData: JwtToken, userData: User) => {
    localStorage.setItem('jwt_token', tokenData.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Set cookie for middleware authentication
    document.cookie = `jwt_token=${tokenData.access_token}; path=/; max-age=86400; SameSite=Strict`;
    setUser(userData);
  };

  // Logout: Clear stored data and redirect
  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    // Also clear the cookie
    document.cookie = 'jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setUser(null);
    // Use window.location for navigation to work in both app and pages router
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}