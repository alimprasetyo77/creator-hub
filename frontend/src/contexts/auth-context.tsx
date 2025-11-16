'use client';

import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { IUser } from '@/types/api/user-type';
import { useGetUser } from '@/hooks/use-users';
import axiosWithConfig from '@/lib/axios-config';
import { toast } from 'sonner';

interface AuthContextValue {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children, hasToken }: { children: React.ReactNode; hasToken?: boolean }) {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(!!hasToken);

  useEffect(() => {
    const interceptor = axiosWithConfig.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          error.response.data.errors = 'Session expired. Please login again.';
          setIsAuthenticated(false);
          queryClient.setQueryData(['user'], null);
          setTimeout(() => window.location.replace('/login'), 1000);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosWithConfig.interceptors.response.eject(interceptor);
    };
  }, [queryClient]);

  const { data: user, isLoading } = useGetUser({
    enabled: isAuthenticated,
  });

  const authContextValue = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading,
      isAuthenticated,
    }),
    [user, isLoading, isAuthenticated]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
