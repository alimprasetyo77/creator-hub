'use client';
import MyPurchasesSkeleton from '@/components/my-purchases-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMyDashboardPurchasesInfo, useMyPurchases } from '@/hooks/use-users';
import { formatIDR } from '@/lib/utils';
import { BanknoteArrowDown, Calendar, Download, Loader2, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
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

  const badgeVariantsForPaymentType = {
    paid: ' bg-green-500 text-white hover:bg-green-600',
    pending: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
    failed: 'bg-red-500 text-white hover:bg-red-600',
  };

  return status === 'pending' || isLoading ? (
    <MyPurchasesSkeleton />
  ) : (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      <div className='container mx-auto px-4 py-8 md:px-6'>
        <div className='mb-8'>
          <h1>My Purchases</h1>
          <p className='text-muted-foreground'>Access all your purchased digital products</p>
        </div>

        <div className='mb-8 grid gap-6 md:grid-cols-3'>
          <Card className='py-0'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Total Purchases</p>
                  <h3 className='mt-2 text-3xl'>{dashboardInfo?.totalPurchases}</h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10'>
                  <Package className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='py-0'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between '>
                <div className='min-w-0'>
                  <p className='text-sm text-muted-foreground'>Total Spent</p>
                  <h3 className='mt-2 text-3xl'>{formatIDR(dashboardInfo?.totalSpent as number)}</h3>
                </div>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10'>
                  <BanknoteArrowDown className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='py-0'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Last Purchase</p>
                  <h3 className='mt-2'>
                    {new Date(dashboardInfo?.lastPurchase || '').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10'>
                  <Calendar className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4'>
          {myPurchases?.map((purchase, index) => (
            <Card key={index} className='overflow-hidden py-0'>
              <CardContent className={`p-0 ${purchase.orderStatus === 'failed' && 'opacity-50'}`}>
                <div className='flex flex-col gap-4 p-6 md:flex-row md:items-center'>
                  <img
                    src={purchase.items[0].thumbnail}
                    alt={purchase.items[0].slug}
                    className='h-32 w-32 rounded-lg object-cover'
                  />

                  <div className='flex-1'>
                    <div className='mb-2 flex items-center gap-2'>
                      <Badge variant='secondary'>{purchase.items[0].category.name.replace('-', ' ')}</Badge>
                      <Badge
                        className={(badgeVariantsForPaymentType as any)[purchase.orderStatus as any]}
                        asChild
                      >
                        <span className='capitalize'>{purchase.orderStatus}</span>
                      </Badge>
                      <span className='text-sm text-muted-foreground'>
                        {purchase.orderStatus === 'paid' ? 'Purchased' : 'Created'} on{' '}
                        {new Date(purchase?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className='mb-2'>{purchase.items[0].title}</h3>
                    <p className='mb-3 text-sm text-muted-foreground line-clamp-2'>
                      {purchase.items[0].description}
                    </p>
                    <p className='text-sm text-muted-foreground'>by {purchase.items[0].user.full_name}</p>
                  </div>

                  <div className='flex flex-col gap-2 md:items-end'>
                    <p className='text-2xl'>{formatIDR(+purchase.paymentInfo.grossAmount)}</p>
                    <div className='flex gap-2'>
                      {purchase.orderStatus === 'paid' && (
                        <Button
                          className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                          onClick={() => window.open('https://google.com', '_blank')}
                        >
                          <Download className='mr-2 h-4 w-4' />
                          Download
                        </Button>
                      )}
                      {['paid', 'pending'].includes(purchase.orderStatus) && (
                        <Button
                          variant='outline'
                          onClick={() => {
                            if (purchase.orderStatus === 'paid') {
                              router.push(`/my-purchases/${purchase.id}`);
                            } else {
                              router.push(`/checkout/${purchase.items[0].id}`);
                            }
                          }}
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {dashboardInfo?.totalPurchases === 0 && (
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
