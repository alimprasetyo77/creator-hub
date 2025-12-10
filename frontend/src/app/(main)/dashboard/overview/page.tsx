'use client';

import OverviewAdmin from '@/components/dashboard/overviews/overview-admin';
import OverviewCreator from '@/components/dashboard/overviews/overview-creator';
import { useAuth } from '@/contexts/auth-context';

export default function Overview() {
  const { user, isAuthenticated } = useAuth();
  if (!user || !isAuthenticated) return null;
  return user?.role === 'CREATOR' ? <OverviewCreator /> : <OverviewAdmin />;
}
