'use client';
import { use, useEffect, useState } from 'react';
import { Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import PaymentDetail from '@/components/checkout/payment-detail';
import OrderSummary from '@/components/checkout/order-summary';
import PaymentSuccessScreen from '@/components/checkout/payment-success-screen';
import { CreateCompleteOrderType } from '@/types/api/order-type';
import { useCreateCompleteOrder, useCancelOrder, useOrder } from '@/hooks/use-orders';
import { toast } from 'sonner';
import { bankOptions } from '@/constants/checkout';
import BankOptions from '@/components/checkout/bank-options';
import PaymentMethod from '@/components/checkout/payment-method';

export type PaymentMethodType = 'bank-transfer' | 'qris';
export type BankOptionType = 'bca' | 'mandiri' | 'bni' | 'bri';

interface CheckoutProps {
  params: Promise<{ id: string }>;
}
export default function Checkout(props: CheckoutProps) {
  const { id: orderId } = use(props.params);
  const router = useRouter();
  const { order, isLoading, refetch } = useOrder(orderId);
  const { createCompleteOrder, isPending } = useCreateCompleteOrder();
  const { cancelOrder, isPending: isCancelOrderPaymentPending } = useCancelOrder();

  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('bank-transfer');
  const [selectedBank, setSelectedBank] = useState<BankOptionType>('bca');

  useEffect(() => {
    if (!order) return;

    if (order.paymentInfo) {
      setShowPaymentDetails(true);
    }
  }, [order]);

  if (isLoading || isCancelOrderPaymentPending) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-linear-to-b from-blue-50 to-white'>
        <div className='text-center'>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-linear-to-b from-blue-50 to-white'>
        <div className='text-center'>
          <h2>No product selected</h2>
          <Button onClick={() => router.push('/explore')} className='mt-4'>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const handleProceedPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let payment_type: CreateCompleteOrderType['payment_type'] = 'bank_transfer';
      if (paymentMethod === 'bank-transfer') {
        if (selectedBank === 'mandiri') {
          payment_type = 'echannel';
        } else {
          payment_type = 'bank_transfer';
        }
      } else {
        payment_type = 'qris';
      }
      await createCompleteOrder({
        payment_type,
        order_id: order.id,
        ...(payment_type === 'bank_transfer' && { bank_transfer: { bank: selectedBank } }),
        ...(payment_type === 'echannel' && {
          echannel: {
            bill_info1: `Payment for : ${order.items[0].title}`,
            bill_info2: 'debt',
            bill_key: '081211111111',
          },
        }),
        ...(payment_type === 'qris' && { qris: { acquirer: 'gopay' } }),
      });
      await refetch();
      setShowPaymentDetails(true);
    } catch (error) {
      if ((error as Error).message === 'Order expired.') {
        router.replace('/explore');
      }
      toast.error((error as Error).message);
    }
  };
  const handleExpirePayment = () => {
    toast('QR Code expired, please try again.');
    setShowPaymentDetails(false);
  };

  const handleCompletePayment = () => {
    setIsSuccess(true);
  };

  const onChangePaymentMethod = async () => {
    const newOrder = await cancelOrder(order.id);
    router.push(`/checkout/${newOrder.data.orderId}`);
  };

  if (isSuccess) {
    return <PaymentSuccessScreen productTitle={order.items[0].title} />;
  }

  if (showPaymentDetails) {
    return (
      <PaymentDetail
        orderId={order.id}
        onChangePaymentMethod={onChangePaymentMethod}
        handleCompletePayment={handleCompletePayment}
        handleExpirePayment={handleExpirePayment}
        paymentLogo={{
          bank: bankOptions.map((option) => ({
            [option.id]: option.logo,
          })),
        }}
      />
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white py-8 md:py-12'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='mb-6'>
          <Button variant='ghost' onClick={() => router.push(`/product/${order.items[0].slug}`)}>
            ← Back to Product
          </Button>
        </div>

        <div className='mx-auto max-w-6xl'>
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-2xl font-medium'>Choose Payment Method</h1>
            <p className='text-muted-foreground'>Select your preferred way to pay</p>
          </div>

          <div className='grid gap-8 lg:grid-cols-3'>
            {/* Payment Method Selection */}
            <div className='lg:col-span-2 space-y-6'>
              <PaymentMethod paymentMethod={paymentMethod} onSelectPaymentMethod={setPaymentMethod} />

              {/* Bank Selection for Bank Transfer */}
              {paymentMethod === 'bank-transfer' && (
                <BankOptions selectedBank={selectedBank} onSelectBank={setSelectedBank} />
              )}

              {/* Security Notice */}
              <div className='flex items-center gap-3 rounded-lg bg-linear-to-br from-emerald-50 to-teal-50 p-4'>
                <div className='rounded-lg bg-white p-2 shadow-sm'>
                  <Lock className='h-5 w-5 text-emerald-600' />
                </div>
                <div className='flex-1 text-sm'>
                  <div className='font-medium text-emerald-900'>Secure Payment</div>
                  <p className='text-emerald-700'>Protected by 256-bit SSL encryption</p>
                </div>
              </div>

              {/* Proceed Button */}
              <Button
                onClick={handleProceedPayment}
                className='w-full bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                size='lg'
                disabled={isPending}
              >
                {isPending ? 'Processing...' : 'Proceed to Payment'}
                <ChevronRight className='ml-2 h-5 w-5' />
              </Button>
            </div>

            {/* Order Summary */}
            <OrderSummary product={order.items[0]} />
          </div>
        </div>
      </div>
    </div>
  );
}
