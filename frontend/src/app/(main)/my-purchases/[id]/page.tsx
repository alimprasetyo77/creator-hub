'use client';

import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/use-orders';
import { use } from 'react';
import MainContent from '@/components/my-purchases/detail/main-content';
import Sidebar from '@/components/my-purchases/detail/sidebar';

interface PurchaseDetailProps {
  params: Promise<{ id: string }>;
}

export default function PurchasesDetail({ params }: PurchaseDetailProps) {
  const { id } = use(params);
  const router = useRouter();
  const { order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
        <div className='container px-4 py-8 md:px-6'>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }
  if (!order) return null;

  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      {/* Header */}
      <div className='border-b bg-white/50 backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-4 md:px-6'>
          <Button variant='ghost' onClick={() => router.push('/my-purchases')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to My Purchases
          </Button>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 md:px-6'>
        <div className='mb-6'>
          <div className='mb-2 flex items-center gap-2'>
            <CheckCircle className='h-6 w-6 text-emerald-600' />
            <h1>Order Complete</h1>
          </div>
          <p className='text-muted-foreground'>
            Thank you for your purchase! Your order details and download links are below.
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Content - 2 columns */}
          <MainContent order={order} />

          {/* Sidebar - 1 column */}
          <Sidebar order={order} />
        </div>
      </div>
    </div>
  );
}
