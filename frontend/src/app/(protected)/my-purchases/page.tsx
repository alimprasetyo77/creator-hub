'use client';
import { Package } from 'lucide-react';
import { useMyDashboardPurchasesInfo } from '@/hooks/use-users';
import { useMyPurchases } from '@/hooks/use-users';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MyPurchasesSkeleton from '@/components/my-purchases/my-purchases-skeleton';
import DashboardCard from '@/components/my-purchases/dashboard-card';
import PurchasesList from '@/components/my-purchases/purchases-list';

export default function page() {
  const router = useRouter();
  const { dashboardInfo, isLoading } = useMyDashboardPurchasesInfo();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { myPurchases, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useMyPurchases();

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return isLoading || status === 'pending' ? (
    <MyPurchasesSkeleton />
  ) : (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      <div className='container mx-auto px-4 py-8 md:px-6'>
        <header className='mb-8'>
          <h1>My Purchases</h1>
          <p className='text-muted-foreground'>Access all your purchased digital products</p>
        </header>

        {/* Dashboard Information */}
        <DashboardCard dashboardInfo={dashboardInfo!} />

        {/* My Purchases */}
        <PurchasesList myPurchases={myPurchases!} />

        {/* No Purchases */}
        {myPurchases?.length === 0 && (
          <Card className='py-0'>
            <CardContent className='p-12 text-center'>
              <Package className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
              <h3 className='mb-2'>No purchases yet</h3>
              <p className='mb-6 text-muted-foreground'>
                Start exploring our marketplace to find amazing digital products
              </p>
              <Button
                className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                onClick={() => router.push('/explore')}
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loader */}
        <div ref={loaderRef} className='mt-10 flex flex-col items-center justify-center'>
          {isFetchingNextPage && <Loader2 className='size-5 animate-spin' />}
          <span className='text-sm'>
            {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Scroll to load more...' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
