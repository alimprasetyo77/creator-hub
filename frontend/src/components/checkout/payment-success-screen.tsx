import { Card, CardContent } from '../ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { redirect } from 'next/navigation';

export default function PaymentSuccessScreen({ productTitle }: { productTitle: string }) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-b from-blue-50 to-white px-4'>
      <Card className='w-full max-w-md border-none text-center shadow-lg'>
        <CardContent className='p-8'>
          <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-500'>
            <CheckCircle className='h-10 w-10 text-white' />
          </div>
          <h2 className='mb-2'>Payment Confirmed!</h2>
          <p className='mb-6 text-muted-foreground'>
            Your purchase of "{productTitle}" is complete. You can now access your files.
          </p>
          <div className='space-y-3'>
            <Button
              className='w-full bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              onClick={() => redirect('/my-purchases')}
            >
              View My Purchases
            </Button>
            <Button variant='outline' className='w-full' onClick={() => redirect('/explore')}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
