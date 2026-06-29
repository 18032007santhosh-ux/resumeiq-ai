import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (password: string, token: string) => Promise<{ success: boolean; message: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check login status on load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.status === 'success') {
            const fetchedUser = res.data.user;
            setUser(fetchedUser);
            localStorage.setItem('user', JSON.stringify(fetchedUser));
          } else {
            // Unexpected response structure
            logout();
          }
        } catch (err) {
          console.error('Auth verification failed', err);
          // If error is 401, Axios interceptor will clean storage, but let's be safe
          if (axiosErrorStatus(err) === 401) {
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const axiosErrorStatus = (err: any) => {
    return err.response?.status;
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const data = res.data;

      if (data.status === 'success') {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, message: data.message || 'Login successful' };
      } else {
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch (err: any) {
      console.error('Frontend Login Error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Server connection failed';
      return { success: false, message: errMsg };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const data = res.data;

      if (data.status === 'success') {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, message: data.message || 'Registration successful' };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (err: any) {
      console.error('Frontend Register Error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Server connection failed';
      return { success: false, message: errMsg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed', err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      const data = res.data;
      return { success: data.status === 'success', message: data.message || 'Reset link requested' };
    } catch (err: any) {
      console.error('Frontend ForgotPassword Error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Server connection failed';
      return { success: false, message: errMsg };
    }
  };

  const resetPassword = async (password: string, token: string) => {
    try {
      const res = await api.post('/auth/reset-password', { password, token });
      const data = res.data;
      return { success: data.status === 'success', message: data.message || 'Password reset succeeded' };
    } catch (err: any) {
      console.error('Frontend ResetPassword Error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Server connection failed';
      return { success: false, message: errMsg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
