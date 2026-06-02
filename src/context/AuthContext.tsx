import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

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

// Função para decodificar JWT manualmente
const decodeToken = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};

// Função para calcular tempo em ms até expiração
const getTimeUntilExpiration = (token: string | null): number | null => {
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;

  // exp está em segundos, converter para ms
  const expirationTime = decoded.exp * 1000;
  const now = Date.now();
  const timeLeft = expirationTime - now;

  return timeLeft > 0 ? timeLeft : 0;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
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
  const [hasWarned, setHasWarned] = useState(false);

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

  // Monitorar expiração do token e fazer logout automático
  useEffect(() => {
    if (!token) {
      setHasWarned(false);
      return;
    }

    const timeLeft = getTimeUntilExpiration(token);
    if (timeLeft === null || timeLeft === 0) return;

    // Configurar timers para aviso (5 min antes) e logout (no expiration)
    const FIVE_MINUTES = 5 * 60 * 1000;
    const warningTime = timeLeft - FIVE_MINUTES;
    const logoutTime = timeLeft;

    const warningTimer = setTimeout(() => {
      if (!hasWarned) {
        setHasWarned(true);
        toast({
          title: 'Sessão expirando em breve',
          description: 'Sua sessão expirará em 5 minutos. Por favor, salve seu trabalho.',
          variant: 'destructive',
        });
      }
    }, Math.max(0, warningTime));

    const logoutTimer = setTimeout(() => {
      toast({
        title: 'Sessão expirada',
        description: 'Sua sessão expirou. Por favor, faça login novamente.',
        variant: 'destructive',
      });
      // Fazer logout
      setToken(null);
      setTempToken(null);
      setRole(null);
      setAuthToken(null);
      setHasWarned(false);
    }, logoutTime);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [token, hasWarned, toast]);

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
