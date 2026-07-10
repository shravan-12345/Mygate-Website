import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

// Provides the logged-in user + auth actions to the entire app.
// Reads/writes localStorage as a cache so a page refresh doesn't lose the
// session before the /auth/me check below confirms it against the server.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = (data) => {
    if (data.token) localStorage.setItem('token', data.token);
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // On first load, verify the cached session against the server (catches
  // expired tokens / deactivated accounts) rather than trusting localStorage blindly.
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { user: freshUser } = await authService.getMe();
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    persistSession(data);
    return data;
  }, []);

  // Mobile + OTP based login. The mobile number is the same one the user
  // registered with — the backend looks it up, checks the OTP, and returns
  // the matching user (with their role) plus a session token.
  const loginWithOtp = useCallback(async (mobile, otp) => {
    const data = await authService.verifyOtp(mobile, otp);
    persistSession(data);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    // Resident/security registrations return no token (pending approval) — only persist if one exists
    if (data.token) persistSession(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, loginWithOtp, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};