/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        const session = await authService.getSession();
        if (session) {
          const profile = await authService.getProfile();
          if (!cancelled) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        if (!cancelled) {
          setError(err.message);
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    initializeAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sign Up
  const signUp = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signup({ name, email, password });
      setUser(response.user || null);
      setIsAuthenticated(Boolean(response.user));
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Sign up failed';
      setError(errorMessage);
      throw new Error(errorMessage, { cause: err });
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
      throw new Error(errorMessage, { cause: err });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out
  const signOut = () => {
    return authService.signout()
      .then(() => {
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Sign out failed'));
  };

  const signInWithGoogle = async (redirectTo) => {
    setError(null);
    try {
      await authService.signInWithGoogle(redirectTo);
    } catch (err) {
      const errorMessage = err.message || 'Google sign-in failed';
      setError(errorMessage);
      throw new Error(errorMessage, { cause: err });
    }
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
      signInWithGoogle,
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