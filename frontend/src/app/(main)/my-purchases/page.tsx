'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, DollarSign, Download, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function page() {
  const mockPurchases = new Array(3).fill(0);
  const router = useRouter();
  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <div className='container mx-auto px-4 py-8 md:px-6'>
        <div className='mb-8'>
          <h1>My Purchases</h1>
          <p className='text-muted-foreground'>Access all your purchased digital products</p>
        </div>

        <div className='mb-8 grid gap-6 md:grid-cols-3'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Total Purchases</p>
                  <h3 className='mt-2 text-3xl'>{mockPurchases.length}</h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10'>
                  <Package className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Total Spent</p>
                  <h3 className='mt-2 text-3xl'>${2000}</h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10'>
                  <DollarSign className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Last Purchase</p>
                  <h3 className='mt-2'>
                    {new Date(mockPurchases[0]?.purchaseDate || '').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10'>
                  <Calendar className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4'>
          {mockPurchases.map((purchase, index) => (
            <Card key={index} className='overflow-hidden'>
              <CardContent className='p-0'>
                <div className='flex flex-col gap-4 p-6 md:flex-row md:items-center'>
                  <img
                    src={purchase?.product?.thumbnail}
                    alt={purchase?.product?.title}
                    className='h-32 w-32 rounded-lg object-cover'
                  />

                  <div className='flex-1'>
                    <div className='mb-2 flex items-center gap-2'>
                      <Badge variant='secondary'>{purchase?.product?.category.replace('-', ' ')}</Badge>
                      <span className='text-sm text-muted-foreground'>
                        Purchased on {new Date(purchase?.purchaseDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className='mb-2'>{purchase?.product?.title}</h3>
                    <p className='mb-3 text-sm text-muted-foreground line-clamp-2'>
                      {purchase?.product?.description}
                    </p>
                    <p className='text-sm text-muted-foreground'>by {purchase?.product?.creator.name}</p>
                  </div>

                  <div className='flex flex-col gap-2 md:items-end'>
                    <p className='text-2xl'>${purchase?.amount}</p>
                    <div className='flex gap-2'>
                      <Button
                        className='bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        onClick={() => window.open(purchase?.downloadUrl, '_blank')}
                      >
                        <Download className='mr-2 h-4 w-4' />
                        Download
                      </Button>
                      <Button variant='outline' onClick={() => router.push('purchase-detail')}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockPurchases.length === 0 && (
          <Card>
            <CardContent className='p-12 text-center'>
              <Package className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
              <h3 className='mb-2'>No purchases yet</h3>
              <p className='mb-6 text-muted-foreground'>
                Start exploring our marketplace to find amazing digital products
              </p>
              <Button
                className='bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                onClick={() => router.push('marketplace')}
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
