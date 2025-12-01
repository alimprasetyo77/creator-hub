import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PaymentMethodType } from '@/app/(main)/checkout/[id]/page';
import { paymentMethods } from '@/constants/checkout';
import { CheckCircle } from 'lucide-react';

interface IPaymentMethodProps {
  paymentMethod: PaymentMethodType;
  onSelectPaymentMethod: (paymentMethod: PaymentMethodType) => void;
}

export default function PaymentMethod({ paymentMethod, onSelectPaymentMethod }: IPaymentMethodProps) {
  return (
    <Card className='border-none shadow-sm'>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-3 sm:grid-cols-2'>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => onSelectPaymentMethod(method.id)}
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
                <method.icon className='size-5' />
              </div>
              <div className='flex-1'>
                <div className='font-medium'>{method.name}</div>
                <p className='text-sm text-muted-foreground'>{method.description}</p>
              </div>
              {paymentMethod === method.id && <CheckCircle className='h-5 w-5 shrink-0 text-blue-600' />}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
