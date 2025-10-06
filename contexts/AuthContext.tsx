'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI } from '@/lib/services/auth';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check token validity periodically
  const checkTokenValidity = async () => {
    const token = localStorage.getItem('fasthub-token');
    if (!token || !user) return;

    try {
      // Check if token is expired
      const decoded: any = jwt.decode(token);
      if (decoded && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          // Token is expired
          logout();
          return;
        }
      }

      // Verify token is still valid with server
      await AuthAPI.getProfile(token);
    } catch (error) {
      // Token is invalid/expired, logout user
      logout();
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('fasthub-user');
    const savedToken = localStorage.getItem('fasthub-token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      // Check token validity immediately and then every 5 minutes
      checkTokenValidity();
      const interval = setInterval(checkTokenValidity, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
    setIsLoading(false);
  }, []);

  // Set loading to false after user is set
  useEffect(() => {
    if (user !== null || (localStorage.getItem('fasthub-user') === null && localStorage.getItem('fasthub-token') === null)) {
      setIsLoading(false);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await AuthAPI.login({ email, password });
      localStorage.setItem('fasthub-token', token);

      const loggedInUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'customer',
      };

      setUser(loggedInUser);
      localStorage.setItem('fasthub-user', JSON.stringify(loggedInUser));
      return true;
    } catch {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, isAdmin = false) => {
    try {
      const response = await AuthAPI.register({ name, email, password, isAdmin });
      const loggedInUser: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
      };
      setUser(loggedInUser);
      localStorage.setItem('fasthub-user', JSON.stringify(loggedInUser));

      // Store token if registration returned one
      if (response.token) {
        localStorage.setItem('fasthub-token', response.token);
      }

      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('fasthub-token');
    if (token) {
      try {
        await AuthAPI.logout(token);
      } catch (error) {
        // Ignore logout API errors
        console.error('Logout API error:', error);
      }
    }
    setUser(null);
    localStorage.removeItem('fasthub-user');
    localStorage.removeItem('fasthub-token');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
