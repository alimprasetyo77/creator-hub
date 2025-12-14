'use client';

import { useAuth } from '@/contexts/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { ROUTE_MAP } from '@/constants/routes';
import { Loading } from './loading';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // const { user, isAuthenticated, isLoading } = useAuth();
  // const pathname = usePathname();
  // const router = useRouter();

  // // 1. Identifikasi Aturan Rute (Policy)
  // const policy = useMemo(() => {
  //   const match = ROUTE_MAP.get(pathname);
  //   if (match) return match;

  //   const segments = pathname.split('/').filter(Boolean);
  //   while (segments.length > 0) {
  //     const parentPath = '/' + segments.join('/');
  //     const parentMatch = ROUTE_MAP.get(parentPath);
  //     if (parentMatch) return parentMatch;
  //     segments.pop();
  //   }
  //   return null;
  // }, [pathname]);

  // // 2. Evaluasi Izin Akses (Strict Evaluation)
  // const accessStatus = useMemo(() => {
  //   if (isLoading) return 'CHECKING';

  //   if (!policy) return 'AUTHORIZED';

  //   if (policy.access === 'guest') {
  //     return isAuthenticated ? 'REDIRECT_BY_ROLE' : 'AUTHORIZED';
  //   }

  //   if (policy.access === 'private') {
  //     if (!isAuthenticated) return 'REDIRECT_TO_LOGIN';

  //     if (policy.roles && (!user?.role || !policy.roles.includes(user.role as any))) {
  //       return 'REDIRECT_BY_ROLE';
  //     }
  //     return 'AUTHORIZED';
  //   }

  //   return 'AUTHORIZED';
  // }, [isLoading, isAuthenticated, user, policy]);

  // // 3. Eksekusi Navigasi
  // useEffect(() => {
  //   if (accessStatus === 'CHECKING' || accessStatus === 'AUTHORIZED') return;

  //   if (accessStatus === 'REDIRECT_TO_LOGIN') {
  //     router.replace('/login');
  //   } else if (accessStatus === 'REDIRECT_BY_ROLE') {
  //     const isAdminOrCreator = user?.role === 'ADMIN' || user?.role === 'CREATOR';
  //     const target = isAdminOrCreator ? '/dashboard/overview' : '/explore';
  //     router.replace(target);
  //   }
  // }, [accessStatus, router, user]);

  // if (accessStatus !== 'AUTHORIZED') {
  //   return <Loading />;
  // }

  return <>{children}</>;
}
