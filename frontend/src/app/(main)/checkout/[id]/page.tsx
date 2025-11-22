'use client';
import { use, useState } from 'react';
import {
  CheckCircle,
  CreditCard,
  Lock,
  Building2,
  Wallet,
  QrCode,
  Store,
  ChevronRight,
  Copy,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetProduct } from '@/hooks/use-products';
import { useRouter } from 'next/navigation';
import PaymentDetail from '@/components/payment-detail';
import OrderSummary from '@/components/order-summary';
import PaymentSuccessScreen from '@/components/payment-success-screen';
import Image from 'next/image';
import { CreateOrderType } from '@/types/api/order-type';
import { useCancelOrder, useCreateOrder } from '@/hooks/use-orders';

export type PaymentMethodType = 'card' | 'bank-transfer' | 'ewallet' | 'qris' | 'convenience-store';
export type BankOptionType = 'bca' | 'mandiri' | 'bni' | 'bri';
export type EwalletOptionType = 'gopay' | 'ovo' | 'dana' | 'shopeepay';
export type StoreOptionType = 'alfamart' | 'indomaret';

interface CheckoutProps {
  params: Promise<{ id: string }>;
}

export default function Checkout(props: CheckoutProps) {
  const { id } = use(props.params);
  const router = useRouter();
  const { product, isLoading } = useGetProduct({ id });
  const { createOrder } = useCreateOrder();
  const { cancelOrder } = useCancelOrder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  const [selectedBank, setSelectedBank] = useState<BankOptionType>('bca');
  const [selectedEwallet, setSelectedEwallet] = useState<EwalletOptionType>('gopay');
  const [selectedStore, setSelectedStore] = useState<StoreOptionType>('alfamart');

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-linear-to-b from-blue-50 to-white'>
        <div className='text-center'>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }
  if (!id || !product) {
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
  const processingFee = product.price * 0.029 + 0.3;
  const total = product.price + processingFee;

  const handleProceedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentDetails(true);
    const bankTransferPayload: CreateOrderType = {
      payment_type: selectedBank === 'mandiri' ? 'echannel' : 'bank_transfer',
      product_id: product.id,
      total_amount: total,
      bank_transfer: {
        bank: selectedBank,
      },
    };

    console.log(bankTransferPayload);
  };

  const handleCompletePayment = () => {
    setIsSuccess(true);
  };

  const paymentMethods = [
    {
      id: 'card' as PaymentMethodType,
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Amex',
      icon: <CreditCard className='h-5 w-5' />,
    },
    {
      id: 'bank-transfer' as PaymentMethodType,
      name: 'Bank Transfer',
      description: 'BCA, Mandiri, BNI, BRI',
      icon: <Building2 className='h-5 w-5' />,
    },
    {
      id: 'ewallet' as PaymentMethodType,
      name: 'E-Wallet',
      description: 'GoPay, OVO, DANA, ShopeePay',
      icon: <Wallet className='h-5 w-5' />,
    },
    {
      id: 'qris' as PaymentMethodType,
      name: 'QRIS',
      description: 'Scan QR code to pay',
      icon: <QrCode className='h-5 w-5' />,
    },
    {
      id: 'convenience-store' as PaymentMethodType,
      name: 'Convenience Store',
      description: 'Alfamart, Indomaret',
      icon: <Store className='h-5 w-5' />,
    },
  ];

  const bankOptions = [
    {
      id: 'bca',
      name: 'BCA',
      logo: 'https://simulator.sandbox.midtrans.com/assets/images/payment_partners/bank_transfer/bca_va.png',
      accountNumber: '1234567890',
      accountName: 'CreatorHub Indonesia',
    },
    {
      id: 'mandiri',
      name: 'Mandiri',
      logo: 'https://simulator.sandbox.midtrans.com/assets/images/payment_partners/bank_transfer/mandiri_bill.png',
      accountNumber: '9876543210',
      accountName: 'CreatorHub Indonesia',
    },
    {
      id: 'bni',
      name: 'BNI',
      logo: 'https://simulator.sandbox.midtrans.com/assets/images/payment_partners/bank_transfer/bni_va.png',
      accountNumber: '5551234567',
      accountName: 'CreatorHub Indonesia',
    },
    {
      id: 'bri',
      name: 'BRI',
      logo: 'https://simulator.sandbox.midtrans.com/assets/images/payment_partners/bank_transfer/bri_va.png',
      accountNumber: '7778889990',
      accountName: 'CreatorHub Indonesia',
    },
  ];

  const ewalletOptions = [
    {
      id: 'gopay',
      name: 'GoPay',
      logo: '💚',
      phoneNumber: '+62 812-3456-7890',
    },
    {
      id: 'ovo',
      name: 'OVO',
      logo: '💜',
      phoneNumber: '+62 812-3456-7891',
    },
    {
      id: 'dana',
      name: 'DANA',
      logo: '💙',
      phoneNumber: '+62 812-3456-7892',
    },
    {
      id: 'shopeepay',
      name: 'ShopeePay',
      logo: '🧡',
      phoneNumber: '+62 812-3456-7893',
    },
  ];

  const storeOptions = [
    { id: 'alfamart', name: 'Alfamart', logo: '🏪' },
    { id: 'indomaret', name: 'Indomaret', logo: '🏪' },
  ];

  // Success Screen
  if (isSuccess) {
    return <PaymentSuccessScreen productTitle={product.title} />;
  }

  // Payment Details Screen
  if (showPaymentDetails) {
    const selectedBankInfo = bankOptions.find((b) => b.id === selectedBank);
    const selectedEwalletInfo = ewalletOptions.find((e) => e.id === selectedEwallet);
    const selectedStoreInfo = storeOptions.find((s) => s.id === selectedStore);

    return (
      <PaymentDetail
        onChangePaymentMethod={() => {
          setShowPaymentDetails(false);
        }}
        paymentMethod={paymentMethod}
        isProcessing={isProcessing}
        handleCompletePayment={handleCompletePayment}
        selectedMethodPaymentInfo={
          paymentMethod === 'bank-transfer'
            ? selectedBankInfo
            : paymentMethod === 'ewallet'
            ? selectedEwalletInfo
            : selectedStoreInfo
        }
        total={total}
      />
    );
  }

  // Main Checkout Screen - Payment Method Selection
  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white py-8 md:py-12'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='mb-6'>
          <Button variant='ghost' onClick={() => router.back()}>
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
              <Card className='border-none shadow-sm'>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-3 sm:grid-cols-2'>
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50/50 ${
                          paymentMethod === method.id
                            ? 'border-blue-600 bg-linear-to-br from-blue-50 to-purple-50'
                            : 'border-border bg-white'
                        }`}
                      >
                        <div
                          className={`rounded-lg p-2 ${
                            paymentMethod === method.id
                              ? 'bg-linear-to-br from-blue-600 to-purple-600 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {method.icon}
                        </div>
                        <div className='flex-1'>
                          <div className='font-medium'>{method.name}</div>
                          <p className='text-sm text-muted-foreground'>{method.description}</p>
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle className='h-5 w-5 shrink-0 text-blue-600' />
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bank Selection for Bank Transfer */}
              {paymentMethod === 'bank-transfer' && (
                <Card className='border-none shadow-sm'>
                  <CardHeader>
                    <CardTitle>Select Bank</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 gap-3'>
                      {bankOptions.map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id as BankOptionType)}
                          className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all hover:border-blue-300 ${
                            selectedBank === bank.id
                              ? 'border-blue-600 bg-linear-to-br from-blue-50 to-purple-50'
                              : 'border-border bg-white'
                          }`}
                        >
                          <Image
                            src={bank.logo}
                            alt={bank.name}
                            width={80}
                            height={80}
                            className='h-6 object-contain object-left'
                          />
                          <span className='font-medium'>{bank.name}</span>
                          {selectedBank === bank.id && (
                            <CheckCircle className='ml-auto h-4 w-4 text-blue-600' />
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* E-Wallet Selection */}
              {paymentMethod === 'ewallet' && (
                <Card className='border-none shadow-sm'>
                  <CardHeader>
                    <CardTitle>Select E-Wallet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 gap-3'>
                      {ewalletOptions.map((ewallet) => (
                        <button
                          key={ewallet.id}
                          onClick={() => setSelectedEwallet(ewallet.id as EwalletOptionType)}
                          className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all hover:border-blue-300 ${
                            selectedEwallet === ewallet.id
                              ? 'border-blue-600 bg-linear-to-br from-blue-50 to-purple-50'
                              : 'border-border bg-white'
                          }`}
                        >
                          <span className='text-2xl'>{ewallet.logo}</span>
                          <span className='font-medium'>{ewallet.name}</span>
                          {selectedEwallet === ewallet.id && (
                            <CheckCircle className='ml-auto h-4 w-4 text-blue-600' />
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Store Selection */}
              {paymentMethod === 'convenience-store' && (
                <Card className='border-none shadow-sm'>
                  <CardHeader>
                    <CardTitle>Select Store</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 gap-3'>
                      {storeOptions.map((store) => (
                        <button
                          key={store.id}
                          onClick={() => setSelectedStore(store.id as StoreOptionType)}
                          className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all hover:border-blue-300 ${
                            selectedStore === store.id
                              ? 'border-blue-600 bg-linear-to-br from-blue-50 to-purple-50'
                              : 'border-border bg-white'
                          }`}
                        >
                          <span className='text-2xl'>{store.logo}</span>
                          <span className='font-medium'>{store.name}</span>
                          {selectedStore === store.id && (
                            <CheckCircle className='ml-auto h-4 w-4 text-blue-600' />
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
              >
                Proceed to Payment
                <ChevronRight className='ml-2 h-5 w-5' />
              </Button>
            </div>

            {/* Order Summary */}
            <OrderSummary product={product} processingFee={processingFee} total={total} />
          </div>
        </div>
      </div>
    </div>
  );
}
