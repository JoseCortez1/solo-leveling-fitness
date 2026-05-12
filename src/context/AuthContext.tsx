import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, getToken, setToken, clearToken, setStoredUser, getStoredUser, clearStoredUser, ApiError } from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify token on mount
  useEffect(() => {
    const token = getToken();
    if (token && !getStoredUser()) {
      // Token exists but no stored user — try to fetch
      api.getMe()
        .then(u => {
          setUser(u);
          setStoredUser(u);
        })
        .catch(() => {
          clearToken();
          clearStoredUser();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const result = await api.login(email, password);
      setToken(result.token);
      setUser(result.user);
      setStoredUser(result.user);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : '[SYSTEM ERROR] Connection failed';
      setError(msg);
      throw e;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    try {
      const result = await api.register(name, email, password);
      setToken(result.token);
      setUser(result.user);
      setStoredUser(result.user);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : '[SYSTEM ERROR] Connection failed';
      setError(msg);
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    clearStoredUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      error,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
