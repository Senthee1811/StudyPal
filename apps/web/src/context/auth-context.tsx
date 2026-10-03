'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudyPalApiClient } from '@studypal/api-client';
import { UserRole } from '@studypal/types';

interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  language: string;
  grade?: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  api: StudyPalApiClient;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Web token storage using session cookies / memory
class WebTokenStorage {
  private access: string | null = null;
  private refresh: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.access = sessionStorage.getItem('sp_at');
      this.refresh = localStorage.getItem('sp_rt');
    }
  }

  getAccessToken() {
    return this.access;
  }
  setAccessToken(token: string | null) {
    this.access = token;
    if (typeof window !== 'undefined') {
      if (token) sessionStorage.setItem('sp_at', token);
      else sessionStorage.removeItem('sp_at');
    }
  }
  getRefreshToken() {
    return this.refresh;
  }
  setRefreshToken(token: string | null) {
    this.refresh = token;
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('sp_rt', token);
      else localStorage.removeItem('sp_rt');
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [api] = useState(() => new StudyPalApiClient({ tokenStorage: new WebTokenStorage() }));

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.auth.getMe();
        if (res.data) {
          setUser(res.data);
        }
      } catch (_) {
        // Not logged in or token expired
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [api]);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    if (res.data?.user) {
      setUser(res.data.user);
    }
  };

  const register = async (data: any) => {
    const res = await api.auth.register(data);
    if (res.data?.user) {
      setUser(res.data.user);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (_) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, api, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
