'use client';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Building2, Copy, QrCode, Store, Wallet } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import Image from 'next/image';
import Link from 'next/link';
import Countdown from '@/hooks/use-countdown';
import { useOrder } from '@/hooks/use-orders';
import { useEffect, useState } from 'react';

interface PaymentDetailProps {
  onChangePaymentMethod: () => void;
  handleCompletePayment: () => void;
  paymentLogo: {
    bank: {
      [key: string]: string;
    }[];

    store: {
      [key: string]: string;
    }[];
  };
  handleExpirePayment: () => void;
}

export default function PaymentDetail({
  onChangePaymentMethod,
  paymentLogo,
  handleCompletePayment,
  handleExpirePayment,
}: PaymentDetailProps) {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('orderId');
    setOrderId(id);
  }, []);

  const { order, isLoading } = useOrder(orderId ?? '', { staleTime: 45000, refetchInterval: 45000 });

  useEffect(() => {
    if (!order) return;

    if (order.orderStatus === 'PAID') {
      handleCompletePayment();
      return;
    }

    if (order.paymentInfo.transactionStatus === 'expire') {
      handleExpirePayment();
      return;
    }
  }, [order]);

  if (!orderId || isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='p-10 text-center'>
        <p>No order found.</p>
      </div>
    );
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white py-8 md:py-12'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='mb-6'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='ghost'>← Change Payment Method</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This action will cancel the ongoing transaction process.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onChangePaymentMethod}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className='mx-auto max-w-6xl'>
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-2xl font-medium'>Complete Payment</h1>
            <p className='text-muted-foreground'>Follow the instructions below to complete your purchase</p>
          </div>

          <div className='grid gap-8 lg:grid-cols-2 '>
            {/* Payment Instructions */}
            <div className='lg:col-span-2  space-y-6'>
              {/* Bank Transfer */}
              {(order?.paymentInfo.paymentType === 'bank_transfer' ||
                order?.paymentInfo.paymentType === 'echannel') && (
                <Card className='border-none shadow-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Building2 className='h-5 w-5 ' />
                      Bank Transfer - {order.paymentInfo.vaNumbers?.bank.toUpperCase() ?? 'Mandiri'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='rounded-lg border-2 border-blue-200 bg-linear-to-br from-blue-50 to-purple-50 p-6'>
                      <p className='mb-4 text-sm text-muted-foreground'>Transfer to this account:</p>

                      <div className='space-y-4'>
                        <div>
                          <Label className='text-xs text-muted-foreground'>Bank Name</Label>
                          <div className='mt-1 flex items-center justify-between rounded-lg bg-white p-3'>
                            <span className='font-medium capitalize'>
                              {order.paymentInfo.vaNumbers?.bank.toUpperCase() ?? 'Mandiri'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label className='text-xs text-muted-foreground'>Account Number</Label>
                          <div className='mt-1 flex items-center justify-between rounded-lg bg-white p-3'>
                            <span className='font-mono'>
                              {order.paymentInfo.vaNumbers?.va_number ?? order.paymentInfo.billKey}
                            </span>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() =>
                                copyToClipboard(
                                  order.paymentInfo.vaNumbers?.va_number ?? order.paymentInfo.billKey
                                )
                              }
                            >
                              <Copy className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className='text-xs text-muted-foreground'>Account Name</Label>
                          <div className='mt-1 flex items-center justify-between rounded-lg bg-white p-3'>
                            <span className='font-medium capitalize'>{'Creator Hub Indonesia'}</span>
                          </div>
                        </div>

                        <div>
                          <Label className='text-xs text-muted-foreground'>Transfer Amount</Label>
                          <div className='mt-1 flex items-center justify-between rounded-lg bg-white p-3'>
                            <span className='text-2xl font-bold text-blue-600'>
                              {order.paymentInfo.grossAmount}
                            </span>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() => copyToClipboard(order.paymentInfo.grossAmount)}
                            >
                              <Copy className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {order.paymentInfo.paymentType === 'echannel' && (
                      <div className='rounded-lg border bg-rose-50 p-4 flex flex-col items-center justify-center'>
                        <p className='mb-2 text-sm font-medium text-rose-900 '>Expire in :</p>
                        <Countdown
                          startTime={new Date().toISOString()}
                          expiryTime={order.paymentInfo.expiryTime}
                        />
                      </div>
                    )}
                    <div className='rounded-lg border bg-amber-50 p-4'>
                      <p className='mb-2 text-sm font-medium text-amber-900'>Important Instructions:</p>
                      <ol className='space-y-1 text-sm text-amber-800'>
                        <li>1. Transfer the exact amount shown above</li>
                        <li>2. Complete transfer within 24 hours</li>
                        <li>3. Payment will be verified automatically</li>
                        <li>4. Access granted immediately after verification</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* QRIS */}
              {order?.paymentInfo.paymentType === 'qris' && (
                <Card className='border-none shadow-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <QrCode className='h-5 w-5' />
                      QRIS Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='rounded-lg border-2 border-cyan-200 bg-linear-to-br from-cyan-50 to-blue-50 p-6'>
                      <div className='mb-4 text-center'>
                        <div className='mx-auto mb-4 flex h-64 w-64 items-center justify-center rounded-lg bg-white p-4 shadow-lg'>
                          {/* <QrCode className='h-48 w-48 text-gray-400' /> */}
                          <Image src={order.paymentInfo.actions.url} alt='QR Code' width={250} height={250} />
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Scan this QR code with any e-wallet app
                        </p>
                      </div>

                      <div className='rounded-lg bg-white p-4 text-center'>
                        <Label className='text-xs text-muted-foreground'>Amount:</Label>
                        <div className='mt-1 text-3xl font-bold text-cyan-600'>
                          {order.paymentInfo.grossAmount}
                        </div>
                      </div>

                      <div className='rounded-lg bg-white p-4 text-center mt-2'>
                        <Label className='text-xs text-muted-foreground'>QR Code Url:</Label>
                        <div className='font-mono mt-1 space-x-4 text-sm font-bold text-cyan-600'>
                          <span>{order.paymentInfo.actions.url}</span>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => copyToClipboard(order.paymentInfo.actions.url)}
                            className='border'
                          >
                            <Copy className='size-3' />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className='rounded-lg border bg-rose-50 p-4 flex flex-col items-center justify-center'>
                      <p className='mb-2 text-sm font-medium text-rose-900 '>Expire in :</p>
                      <Countdown
                        startTime={new Date().toISOString()}
                        expiryTime={order.paymentInfo.expiryTime}
                      />
                    </div>

                    <div className=' rounded-lg border bg-amber-50 p-4'>
                      <p className='mb-2 text-sm font-medium text-amber-900'>How to Pay:</p>
                      <ol className='space-y-1 text-sm text-amber-800'>
                        <li>
                          1. Open{' '}
                          <Link
                            target='_blank'
                            href='https://simulator.sandbox.midtrans.com/'
                            className='underline'
                          >
                            Midtrans Payment Simulator
                          </Link>
                        </li>
                        <li>2. Find "QRIS" menu</li>
                        <li>3. Copy the QR code url above</li>
                        <li>4. Verify amount and complete payment</li>
                      </ol>
                    </div>

                    <div className='flex flex-wrap gap-2'>
                      <Badge variant='secondary'>💚 GoPay</Badge>
                      <Badge variant='secondary'>💜 OVO</Badge>
                      <Badge variant='secondary'>💙 DANA</Badge>
                      <Badge variant='secondary'>🧡 ShopeePay</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Convenience Store */}
              {order?.paymentInfo.paymentType === 'convenience-store' && (
                <Card className='border-none shadow-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Store className='h-5 w-5' />
                      {order.paymentInfo.paymentType} Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='rounded-lg border-2 border-orange-200 bg-linear-to-br from-orange-50 to-red-50 p-6 text-center'>
                      <div className='mb-4 text-6xl'>
                        {paymentLogo.store[order.paymentInfo.paymentType as any] as any}
                      </div>

                      <div className='space-y-4'>
                        <div>
                          <Label className='text-xs text-muted-foreground'>Payment Code:</Label>
                          <div className='mt-2 flex items-center justify-center gap-2 rounded-lg bg-white p-4'>
                            <span className='text-2xl font-mono font-bold tracking-wider'>
                              CRTR-
                              {Math.random().toString(36).substring(2, 10).toUpperCase()}
                            </span>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() =>
                                copyToClipboard(
                                  `CRTR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                                )
                              }
                            >
                              <Copy className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className='text-xs text-muted-foreground'>Amount to Pay:</Label>
                          <div className='mt-2 rounded-lg bg-white p-4'>
                            <span className='text-3xl font-bold text-orange-600'>
                              {order.paymentInfo.grossAmount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='rounded-lg border bg-orange-50 p-4'>
                      <p className='mb-2 text-sm font-medium text-orange-900'>Payment Instructions:</p>
                      <ol className='space-y-1 text-sm text-orange-800'>
                        <li>1. Visit nearest {order.paymentInfo.paymentType.toUpperCase()} store</li>
                        <li>2. Show payment code to cashier</li>
                        <li>3. Pay the exact amount in cash</li>
                        <li>4. Keep your receipt</li>
                        <li>5. Payment verified automatically</li>
                      </ol>
                    </div>

                    <div className='rounded-lg border-2 border-amber-300 bg-amber-50 p-4 text-center'>
                      <p className='text-sm font-medium text-amber-900'>⏰ Valid for 24 hours</p>
                      <p className='text-xs text-amber-700'>Pay before expiration to complete purchase</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
