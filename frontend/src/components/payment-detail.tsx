'use client';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Building2, Copy, CreditCard, QrCode, Store, Wallet } from 'lucide-react';
import { PaymentMethodType } from '@/app/(main)/checkout/[id]/page';
import { Label } from '@/components/ui/label';
import { Input } from './ui/input';
import { convertToIDR } from '@/lib/utils';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useOrder } from '@/hooks/use-orders';

interface PaymentDetailProps {
  onChangePaymentMethod: () => void;
  paymentMethod: PaymentMethodType;
  isProcessing: boolean;
  handleCompletePayment: () => void;
  selectedMethodPaymentInfo: any;
  total: number;
}

export default function PaymentDetail({
  onChangePaymentMethod,
  paymentMethod,
  isProcessing,
  handleCompletePayment,
  selectedMethodPaymentInfo,
  total,
}: PaymentDetailProps) {
  const { order } = useOrder(localStorage.getItem('orderId') as string);

  if (order?.orderStatus === 'PAID') {
    handleCompletePayment();
    return;
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
          <Button variant='ghost' onClick={onChangePaymentMethod}>
            ← Change Payment Method
          </Button>
        </div>

        <div className='mx-auto max-w-6xl'>
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-2xl font-medium'>Complete Payment</h1>
            <p className='text-muted-foreground'>Follow the instructions below to complete your purchase</p>
          </div>

          <div className='grid gap-8 lg:grid-cols-2 '>
            {/* Payment Instructions */}
            <div className='lg:col-span-2  space-y-6'>
              {/* Card Payment */}
              {order?.paymentInfo.paymentType === 'card' && (
                <Card className='border-none shadow-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <CreditCard className='h-5 w-5' />
                      Card Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCompletePayment();
                      }}
                      className='space-y-4'
                    >
                      <div className='space-y-2'>
                        <Label htmlFor='cardNumber'>Card Number</Label>
                        <Input
                          id='cardNumber'
                          type='text'
                          placeholder='4242 4242 4242 4242'
                          maxLength={19}
                          required
                        />
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='expiry'>Expiry Date</Label>
                          <Input id='expiry' type='text' placeholder='MM/YY' maxLength={5} required />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='cvc'>CVC</Label>
                          <Input id='cvc' type='text' placeholder='123' maxLength={4} required />
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='cardName'>Cardholder Name</Label>
                        <Input id='cardName' type='text' placeholder='John Doe' required />
                      </div>

                      <Button
                        type='submit'
                        className='w-full bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        size='lg'
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Bank Transfer */}
              {order?.paymentInfo.paymentType === 'bank_transfer' && (
                <Card className='border-none shadow-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Building2 className='h-5 w-5 ' />
                      Bank Transfer - {order.paymentInfo.vaNumbers.bank.toUpperCase()}
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
                              {order.paymentInfo.vaNumbers.bank.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label className='text-xs text-muted-foreground'>Account Number</Label>
                          <div className='mt-1 flex items-center justify-between rounded-lg bg-white p-3'>
                            <span className='font-mono'>{order.paymentInfo.vaNumbers.va_number}</span>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() => copyToClipboard(order.paymentInfo.vaNumbers.va_number)}
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

                    <div className='rounded-lg border bg-amber-50 p-4'>
                      <p className='mb-2 text-sm font-medium text-amber-900'>Important Instructions:</p>
                      <ol className='space-y-1 text-sm text-amber-800'>
                        <li>1. Transfer the exact amount shown above</li>
                        <li>2. Complete transfer within 24 hours</li>
                        <li>3. Payment will be verified automatically</li>
                        <li>4. Access granted immediately after verification</li>
                      </ol>
                    </div>

                    <Button
                      className='w-full bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      size='lg'
                      onClick={handleCompletePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Verifying Payment...' : 'I Have Completed the Transfer'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* E-Wallet */}
              {paymentMethod === 'ewallet' && selectedMethodPaymentInfo && (
                <Card className='border-none shadow-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Wallet className='h-5 w-5' />
                      {selectedMethodPaymentInfo.name} Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='rounded-lg border-2 border-purple-200 bg-linear-to-br from-purple-50 to-pink-50 p-6 text-center'>
                      <div className='mb-4 text-6xl'>{selectedMethodPaymentInfo.logo}</div>

                      <div className='space-y-4'>
                        <div>
                          <Label className='text-xs text-muted-foreground'>Send payment to:</Label>
                          <div className='mt-2 flex items-center justify-center gap-2 rounded-lg bg-white p-4'>
                            <span className='text-xl font-mono'>{selectedMethodPaymentInfo.phoneNumber}</span>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() => copyToClipboard(selectedMethodPaymentInfo.phoneNumber)}
                            >
                              <Copy className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className='text-xs text-muted-foreground'>Amount to Pay:</Label>
                          <div className='mt-2 rounded-lg bg-white p-4'>
                            <span className='text-3xl font-bold text-purple-600'>{convertToIDR(total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='rounded-lg border bg-purple-50 p-4'>
                      <p className='mb-2 text-sm font-medium text-purple-900'>Payment Steps:</p>
                      <ol className='space-y-1 text-sm text-purple-800'>
                        <li>1. Open your {selectedMethodPaymentInfo.name} app</li>
                        <li>2. Select "Send Money" or "Transfer"</li>
                        <li>3. Enter the phone number above</li>
                        <li>4. Send the exact amount shown</li>
                        <li>5. Click button below after payment</li>
                      </ol>
                    </div>

                    <Button
                      className='w-full bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      size='lg'
                      onClick={handleCompletePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Verifying Payment...' : 'I Have Sent the Payment'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* QRIS */}
              {paymentMethod === 'qris' && (
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
                          <QrCode className='h-48 w-48 text-gray-400' />
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Scan this QR code with any e-wallet app
                        </p>
                      </div>

                      <div className='rounded-lg bg-white p-4 text-center'>
                        <Label className='text-xs text-muted-foreground'>Amount:</Label>
                        <div className='mt-1 text-3xl font-bold text-cyan-600'>{convertToIDR(total)}</div>
                      </div>
                    </div>

                    <div className='rounded-lg border bg-cyan-50 p-4'>
                      <p className='mb-2 text-sm font-medium text-cyan-900'>How to Pay:</p>
                      <ol className='space-y-1 text-sm text-cyan-800'>
                        <li>1. Open any Indonesian e-wallet app (GoPay, OVO, DANA, etc.)</li>
                        <li>2. Find "Scan QR" or "QRIS" menu</li>
                        <li>3. Scan the QR code above</li>
                        <li>4. Verify amount and complete payment</li>
                      </ol>
                    </div>

                    <div className='flex flex-wrap gap-2'>
                      <Badge variant='secondary'>💚 GoPay</Badge>
                      <Badge variant='secondary'>💜 OVO</Badge>
                      <Badge variant='secondary'>💙 DANA</Badge>
                      <Badge variant='secondary'>🧡 ShopeePay</Badge>
                    </div>

                    <Button
                      className='w-full bg-linear-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700'
                      size='lg'
                      onClick={handleCompletePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Verifying Payment...' : 'I Have Scanned & Paid'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Convenience Store */}
              {paymentMethod === 'convenience-store' && selectedMethodPaymentInfo && (
                <Card className='border-none shadow-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Store className='h-5 w-5' />
                      {selectedMethodPaymentInfo.name} Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='rounded-lg border-2 border-orange-200 bg-linear-to-br from-orange-50 to-red-50 p-6 text-center'>
                      <div className='mb-4 text-6xl'>{selectedMethodPaymentInfo.logo}</div>

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
                            <span className='text-3xl font-bold text-orange-600'>{convertToIDR(total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='rounded-lg border bg-orange-50 p-4'>
                      <p className='mb-2 text-sm font-medium text-orange-900'>Payment Instructions:</p>
                      <ol className='space-y-1 text-sm text-orange-800'>
                        <li>1. Visit nearest {selectedMethodPaymentInfo.name} store</li>
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

                    <Button
                      className='w-full bg-linear-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700'
                      size='lg'
                      onClick={handleCompletePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Verifying Payment...' : 'I Have Paid at Store'}
                    </Button>
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
