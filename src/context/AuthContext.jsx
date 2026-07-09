import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('csehub-token');
        if (token) {
          const isValid = await authService.validateToken();
          if (isValid) {
            const profile = await authService.getProfile();
            setUser(profile.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('csehub-token');
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        localStorage.removeItem('csehub-token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign Up
  const signUp = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signup({ name, email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Sign up failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign In
  const signIn = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signin({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Sign in failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out
  const signOut = () => {
    authService.signout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      signIn,
      signUp,
      signOut,
      clearError: () => setError(null),
    }),
    [user, isAuthenticated, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}