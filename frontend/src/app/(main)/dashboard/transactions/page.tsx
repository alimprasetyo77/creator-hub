'use client';

import TransactionsAdmin from '@/components/dashboard/transactions/transactions-admin';
import TransactionsCreator from '@/components/dashboard/transactions/transactions-creator';
import { useAuth } from '@/contexts/auth-context';

export default function Transactions() {
  const { user } = useAuth();
  if (!user) return null;
  return user?.role === 'CREATOR' ? <TransactionsCreator /> : <TransactionsAdmin />;
}
