'use client';
import { formatIDR } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PurchasesListProps {
  myPurchases: any[];
}
export default function PurchasesList({ myPurchases }: PurchasesListProps) {
  if (myPurchases.length === 0) return null;

  const router = useRouter();

  const badgeVariantsForPaymentType = {
    paid: ' bg-green-500 text-white hover:bg-green-600',
    pending: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
    failed: 'bg-red-500 text-white hover:bg-red-600',
    expired: 'bg-gray-500 text-white hover:bg-gray-600',
  };

  return (
    <div className='space-y-4'>
      {myPurchases.map((purchase, index) => (
        <Card key={index} className='overflow-hidden py-0'>
          <CardContent
            className={`p-0 ${['failed', 'expired'].includes(purchase.orderStatus) && 'opacity-50'}`}
          >
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
                <p className='text-2xl'>
                  {formatIDR(+purchase.paymentInfo?.grossAmount || purchase.items[0].total)}
                </p>
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
                          router.push(`/checkout/${purchase.id}`);
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
  );
}
