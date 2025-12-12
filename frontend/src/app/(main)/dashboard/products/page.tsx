'use client';

import ProductsAdmin from '@/components/dashboard/products/products-admin';
import ProductsCreator from '@/components/dashboard/products/products-creator';
import { useAuth } from '@/contexts/auth-context';

export default function Products() {
  const { user } = useAuth();
  if (!user) return null;

  return user?.role === 'CREATOR' ? <ProductsCreator /> : <ProductsAdmin />;
}
