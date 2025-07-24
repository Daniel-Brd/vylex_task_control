import { ACCESS_TOKEN_KEY } from '@/shared/api';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext } from '../model/context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (storedToken) {
        setAccessToken(storedToken);
      }
    } catch (error) {
      console.error('Falha ao acessar o localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    setAccessToken(token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setAccessToken(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: !!accessToken,
      accessToken,
      isLoading,
      login,
      logout,
    }),
    [accessToken, isLoading, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
