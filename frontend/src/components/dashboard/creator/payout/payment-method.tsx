'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CircleDollarSign, CreditCard, Edit, Plus, Trash2, Wallet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PaymentMethod() {
  const [paymentMethods, setPaymentMethods] = useState<any>([
    {
      id: 'pm1',
      type: 'bank',
      name: 'BCA - Primary Account',
      isDefault: true,
      details: {
        accountName: 'John Doe',
        accountNumber: '1234567890',
        bankName: 'Bank Central Asia',
        swiftCode: 'CENAIDJA',
      },
    },
    {
      id: 'pm2',
      type: 'paypal',
      name: 'PayPal Account',
      isDefault: false,
      details: {
        email: 'john.doe@example.com',
      },
    },
  ]);
  const [paymentForm, setPaymentForm] = useState({
    type: 'bank' as 'bank' | 'paypal' | 'stripe',
    name: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    swiftCode: '',
    email: '',
    accountId: '',
  });
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <p className='text-sm text-muted-foreground mt-1'>Manage your payment methods for withdrawals</p>
          </div>
          <Button
            onClick={() => {
              setPaymentForm({
                type: 'bank',
                name: '',
                accountName: '',
                accountNumber: '',
                bankName: '',
                swiftCode: '',
                email: '',
                accountId: '',
              });
            }}
            className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
          >
            <Plus className='mr-2 h-4 w-4' />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className='rounded-lg border border-dashed p-12 text-center'>
            <Wallet className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
            <h3 className='mb-2'>No Payment Methods</h3>
            <p className='text-sm text-muted-foreground'>
              Add your first payment method to start receiving withdrawals
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {paymentMethods.map((method: any) => (
              <div
                key={method.id}
                className='flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors'
              >
                <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600'>
                    {method.type === 'bank' && <Building2 className='h-6 w-6 text-white' />}
                    {method.type === 'paypal' && <CircleDollarSign className='h-6 w-6 text-white' />}
                    {method.type === 'stripe' && <CreditCard className='h-6 w-6 text-white' />}
                  </div>
                  <div>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium'>{method.name}</p>
                      {method.isDefault && <Badge variant='default'>Default</Badge>}
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {method.type === 'bank' &&
                        `${method.details.bankName} • ****${method.details.accountNumber?.slice(-4)}`}
                      {method.type === 'paypal' && method.details.email}
                      {method.type === 'stripe' && `Stripe • ${method.details.accountId}`}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  {!method.isDefault && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        const updatedMethods = paymentMethods.map((m: any) => ({
                          ...m,
                          isDefault: m.id === method.id,
                        }));
                        setPaymentMethods(updatedMethods);
                        toast.success(`${method.name} set as default payment method`);
                      }}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setPaymentForm({
                        type: method.type,
                        name: method.name,
                        accountName: method.details.accountName || '',
                        accountNumber: method.details.accountNumber || '',
                        bankName: method.details.bankName || '',
                        swiftCode: method.details.swiftCode || '',
                        email: method.details.email || '',
                        accountId: method.details.accountId || '',
                      });
                    }}
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      if (paymentMethods.length === 1) {
                        toast.error('You must have at least one payment method');
                        return;
                      }
                      const updatedMethods = paymentMethods.filter((m: any) => m.id !== method.id);
                      setPaymentMethods(updatedMethods);
                      toast.success(`Payment method "${method.name}" deleted successfully!`);
                    }}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
