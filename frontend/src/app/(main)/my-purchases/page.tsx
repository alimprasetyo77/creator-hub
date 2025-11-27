'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMyPurchases } from '@/hooks/use-users';
import { formatIDR } from '@/lib/utils';
import { Calendar, DollarSign, Download, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function page() {
  const router = useRouter();
  const { myPurchases } = useMyPurchases();
  return (
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
                  <h3 className='mt-2 text-3xl'>{myPurchases?.totalPurchases}</h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10'>
                  <Package className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='py-0'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Total Spent</p>
                  <h3 className='mt-2 text-3xl'>Rp. {myPurchases?.totalSpent}</h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10'>
                  <DollarSign className='h-6 w-6 text-purple-600' />
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
                    {new Date(myPurchases?.lastPurchase as string).toLocaleDateString('en-US', {
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
          {myPurchases?.orders.map((purchase, index) => (
            <Card key={index} className='overflow-hidden py-0'>
              <CardContent className='p-0'>
                <div className='flex flex-col gap-4 p-6 md:flex-row md:items-center'>
                  <img
                    src={purchase.items[0].thumbnail}
                    alt={purchase.items[0].slug}
                    className='h-32 w-32 rounded-lg object-cover'
                  />

                  <div className='flex-1'>
                    <div className='mb-2 flex items-center gap-2'>
                      <Badge variant='secondary'>{purchase.items[0].category.name.replace('-', ' ')}</Badge>
                      <span className='text-sm text-muted-foreground'>
                        Purchased on {new Date(purchase?.createdAt).toLocaleDateString()}
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
                      <Button
                        className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        onClick={() => window.open('https://google.com', '_blank')}
                      >
                        <Download className='mr-2 h-4 w-4' />
                        Download
                      </Button>
                      <Button variant='outline' onClick={() => router.push(`/my-purchases/${purchase.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {myPurchases?.orders.length === 0 && (
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
      </div>
    </div>
  );
}
