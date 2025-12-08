'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeleteWithdrawalMethod, useSetDefaultWithdrawalMethod } from '@/hooks/use-creator';
import { Building2, Edit, Plus, Trash2, Wallet } from 'lucide-react';
import { useState } from 'react';
import AddEditPaymentMethod from './add-edit-payment-method';
import { IWithdrawalMethod } from '@/types/api/creator-type';

interface PaymentMethodProps {
  data: IWithdrawalMethod[];
}

export default function PaymentMethod({ data }: PaymentMethodProps) {
  const { deleteWithdrawalMethod, isPending: deleteWithdrawalMethodPending } = useDeleteWithdrawalMethod();
  const { setDefaultWidrawalMethod, isPending: setDefaultWidrawalMethodPending } =
    useSetDefaultWithdrawalMethod();
  const [isOpenAddEditPaymentMethod, setIsOpenAddEditPaymentMethod] = useState<'add' | 'edit' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<IWithdrawalMethod | null>(null);
  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <p className='text-sm text-muted-foreground mt-1'>
                Manage your payment methods for withdrawals
              </p>
            </div>
            <Button
              onClick={() => {
                setIsOpenAddEditPaymentMethod('add');
              }}
              className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            >
              <Plus className='mr-2 h-4 w-4' />
              Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data?.length === 0 ? (
            <div className='rounded-lg border border-dashed p-12 text-center'>
              <Wallet className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
              <h3 className='mb-2'>No Payment Methods</h3>
              <p className='text-sm text-muted-foreground'>
                Add your first payment method to start receiving withdrawals
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {data?.map((method) => (
                <div
                  key={method.id}
                  className='flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors'
                >
                  <div className='flex items-center gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600'>
                      {method.type === 'BANK_TRANSFER' && <Building2 className='h-6 w-6 text-white' />}
                      {method.type === 'E_WALLET' && <Wallet className='h-6 w-6 text-white' />}
                    </div>
                    <div>
                      <div className='flex items-center gap-2'>
                        <p className='font-medium'>{method.name}</p>
                        {method.is_default && <Badge variant='default'>Default</Badge>}
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        {method.type === 'BANK_TRANSFER' &&
                          `${method.details.bank_name} • ****${method.details.account_number?.slice(-4)}`}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    {!method.is_default && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        disabled={setDefaultWidrawalMethodPending}
                        onClick={() => {
                          setDefaultWidrawalMethod(method.id);
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
                        setIsOpenAddEditPaymentMethod('edit');
                        setPaymentMethod(method);
                      }}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      disabled={deleteWithdrawalMethodPending}
                      onClick={() => deleteWithdrawalMethod(method.id)}
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
      <AddEditPaymentMethod
        isOpenAddEditPaymentMethod={isOpenAddEditPaymentMethod}
        setIsOpenAddEditPaymentMethod={setIsOpenAddEditPaymentMethod}
        paymentMethod={paymentMethod!}
      />
    </>
  );
}
