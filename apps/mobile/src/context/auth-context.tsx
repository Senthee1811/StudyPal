import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudyPalApiClient, ITokenStorage } from '@studypal/api-client';

// Mobile SecureStore abstraction (in-memory in simulator/headless environments)
class MobileSecureTokenStorage implements ITokenStorage {
  private memoryStore = new Map<string, string>();

  async getAccessToken() {
    return this.memoryStore.get('sp_mobile_access') || null;
  }
  async setAccessToken(token: string | null) {
    if (token) this.memoryStore.set('sp_mobile_access', token);
    else this.memoryStore.delete('sp_mobile_access');
  }
  async getRefreshToken() {
    return this.memoryStore.get('sp_mobile_refresh') || null;
  }
  async setRefreshToken(token: string | null) {
    if (token) this.memoryStore.set('sp_mobile_refresh', token);
    else this.memoryStore.delete('sp_mobile_refresh');
  }
}

interface MobileAuthContextType {
  user: any | null;
  api: StudyPalApiClient;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const MobileAuthContext = createContext<MobileAuthContextType | undefined>(undefined);

export function MobileAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>({
    id: 'mobile-student-001',
    displayName: 'Student (Mobile)',
    email: 'student@studypal.lk',
    grade: 9,
    role: 'STUDENT',
  });

  const [api] = useState(() => new StudyPalApiClient({ tokenStorage: new MobileSecureTokenStorage() }));

  const login = async (email: string, pass: string) => {
    const res = await api.auth.login({ email, password: pass });
    if (res.data?.user) setUser(res.data.user);
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <MobileAuthContext.Provider value={{ user, api, login, logout }}>
      {children}
    </MobileAuthContext.Provider>
  );
}

export function useMobileAuth() {
  const ctx = useContext(MobileAuthContext);
  if (!ctx) throw new Error('useMobileAuth must be used within MobileAuthProvider');
  return ctx;
}
