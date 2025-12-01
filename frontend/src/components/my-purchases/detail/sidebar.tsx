import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatIDR } from '@/lib/utils';
import { IOrder } from '@/types/api/order-type';
import { Calendar, CreditCard, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  order: IOrder;
}

export default function Sidebar({ order }: SidebarProps) {
  const router = useRouter();
  const invoiceNumber = `INV-${order.id.toUpperCase()}-${new Date(
    order?.paymentInfo.transactionTime as any
  ).getFullYear()}`;
  return (
    <div className='lg:col-span-1'>
      <div className='sticky top-20 space-y-6'>
        {/* Order Summary */}
        <Card className='border-none shadow-sm py-0'>
          <CardContent className='p-6'>
            <h3 className='mb-4'>Order Summary</h3>

            <div className='space-y-4'>
              <div className='flex items-center gap-3 rounded-lg bg-muted/50 p-3'>
                <Calendar className='h-5 w-5 text-muted-foreground' />
                <div className='flex-1'>
                  <div className='text-sm text-muted-foreground'>Purchase Date</div>
                  <div>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-3 rounded-lg bg-muted/50 p-3'>
                <FileText className='h-5 w-5 text-muted-foreground' />
                <div className='flex-1'>
                  <div className='text-sm text-muted-foreground'>Invoice Number</div>
                  <div className='font-mono text-sm'>{invoiceNumber}</div>
                </div>
              </div>

              <div className='flex items-center gap-3 rounded-lg bg-muted/50 p-3'>
                <CreditCard className='h-5 w-5 text-muted-foreground' />
                <div className='flex-1'>
                  <div className='text-sm text-muted-foreground'>Payment Method</div>
                  <div className='capitalize'>{order.paymentInfo.paymentType.replace('_', ' ')}</div>
                </div>
              </div>
            </div>

            <Separator className='my-6' />

            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Product Price</span>
                <span>{formatIDR(order.items[0].price)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Processing Fee</span>
                <span>{formatIDR(0)}</span>
              </div>
              <Separator className='my-3' />
              <div className='flex justify-between'>
                <span>Total Paid</span>
                <span className='bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl text-transparent'>
                  {formatIDR(+order.paymentInfo.grossAmount)}
                </span>
              </div>
            </div>

            <Button variant='outline' className='mt-6 w-full'>
              <FileText className='mr-2 h-4 w-4' />
              Download Invoice
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className='border-none shadow-sm py-0'>
          <CardContent className='p-6'>
            <h3 className='mb-4'>Quick Actions</h3>
            <div className='space-y-2'>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => router.push('/my-purchases')}
              >
                View All Purchases
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => router.push('/explore')}
              >
                Browse More Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
