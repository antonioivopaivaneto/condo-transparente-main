import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '@/services/api';

type UserRole = 'sindico' | 'morador' | null;

type AuthContextType = {
  token: string | null;
  tempToken: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  setTempToken: (token: string | null) => void;
  setRole: (role: UserRole) => void;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  });
  const [tempToken, setTempToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('tempToken');
  });
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window === 'undefined') return null;
    const storedRole = localStorage.getItem('userRole');
    return storedRole === 'sindico' || storedRole === 'morador' ? storedRole : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token);
    } else {
      localStorage.removeItem('token');
      if (!tempToken) {
        setAuthToken(null);
      }
    }
  }, [token, tempToken]);

  useEffect(() => {
    if (tempToken) {
      localStorage.setItem('tempToken', tempToken);
      api.defaults.headers.common.Authorization = `Bearer ${tempToken}`;
    } else {
      localStorage.removeItem('tempToken');
      if (token) {
        setAuthToken(token);
      }
    }
  }, [tempToken, token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [role]);

  const login = (newToken: string, userRole: UserRole) => {
    setTempToken(null);
    setToken(newToken);
    setRole(userRole);
  };

  const logout = () => {
    setToken(null);
    setTempToken(null);
    setRole(null);
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      tempToken,
      role,
      isAuthenticated: Boolean(token),
      setTempToken,
      setRole,
      login,
      logout
    }),
    [token, tempToken, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
