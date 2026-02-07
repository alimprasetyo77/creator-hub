import { PaymentMethodType } from '@/app/(protected)/checkout/[id]/page';
import { Building2, QrCode } from 'lucide-react';

const paymentMethods = [
  {
    id: 'bank-transfer' as PaymentMethodType,
    name: 'Bank Transfer',
    description: 'BCA, Mandiri, BNI, BRI',
    icon: Building2,
  },

  {
    id: 'qris' as PaymentMethodType,
    name: 'QRIS',
    description: 'Scan QR code to pay',
    icon: QrCode,
  },
];

const bankOptions = [
  {
    id: 'bca',
    name: 'BCA',
    logo: 'https://simulator.sandbox.midtrans.com/assets/images/payment_partners/bank_transfer/bca_va.png',
  },
  {
    id: 'mandiri',
    name: 'Mandiri',
    logo: 'https://simulator.sandbox.midtrans.com/assets/images/payment_partners/bank_transfer/mandiri_bill.png',
  },
  {
    id: 'bni',
    name: 'BNI',
    logo: 'https://simulator.sandbox.midtrans.com/assets/images/payment_partners/bank_transfer/bni_va.png',
  },
  {
    id: 'bri',
    name: 'BRI',
    logo: 'https://simulator.sandbox.midtrans.com/assets/images/payment_partners/bank_transfer/bri_va.png',
  },
];

export { paymentMethods, bankOptions };
